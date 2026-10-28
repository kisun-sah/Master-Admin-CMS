import { BlogPost } from '../models/BlogPost.js';
import { recordAudit } from '../services/auditService.js';

export async function listBlogPosts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } },
      ];
    }

    const sortField = req.query.sortBy || 'publishDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const [total, posts] = await Promise.all([
      BlogPost.countDocuments(filter),
      BlogPost.find(filter)
        .populate('author', 'displayName email')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getBlogPostById(req, res, next) {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, isDeleted: false }).populate(
      'author',
      'displayName email'
    );
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Blog post not found.' },
      });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function createBlogPost(req, res, next) {
  try {
    const { title, slug, excerpt, body, featuredImage, category, tags, status, featured, seo, publishDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Blog post title is required.' },
      });
    }

    const normalizedSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
      .toLowerCase()
      .trim();

    const existing = await BlogPost.findOne({ slug: normalizedSlug, isDeleted: false });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: `Blog post with slug '${normalizedSlug}' already exists.` },
      });
    }

    // Estimate reading time: 200 words per minute
    const wordCount = (body || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const post = await BlogPost.create({
      title: title.trim(),
      slug: normalizedSlug,
      excerpt: excerpt || '',
      body: body || '',
      featuredImage: featuredImage || '',
      category: category || 'Insights',
      tags: tags || [],
      author: req.user?._id,
      authorName: req.user?.displayName || 'Editorial Team',
      readingTimeMinutes,
      status: status || 'draft',
      featured: !!featured,
      publishDate: publishDate || (status === 'published' ? new Date() : null),
      seo: seo || {},
    });

    await recordAudit(req, {
      action: 'blog.create',
      resourceType: 'BlogPost',
      resourceId: post._id,
      details: { title: post.title },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function updateBlogPost(req, res, next) {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, isDeleted: false });
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Blog post not found.' },
      });
    }

    const { title, slug, excerpt, body, featuredImage, category, tags, status, featured, seo, publishDate } = req.body;

    if (slug && slug !== post.slug) {
      const normalizedSlug = slug.toLowerCase().trim();
      const conflict = await BlogPost.findOne({
        slug: normalizedSlug,
        _id: { $ne: post._id },
        isDeleted: false,
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          error: { code: 'CONFLICT', message: `Slug '${normalizedSlug}' is already in use.` },
        });
      }
      post.slug = normalizedSlug;
    }

    if (title) post.title = title.trim();
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (body !== undefined) {
      post.body = body;
      const wordCount = body.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
      post.readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    }
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (status !== undefined) {
      if (status === 'published' && post.status !== 'published' && !post.publishDate) {
        post.publishDate = new Date();
      }
      post.status = status;
    }
    if (featured !== undefined) post.featured = featured;
    if (seo !== undefined) post.seo = seo;
    if (publishDate !== undefined) post.publishDate = publishDate;

    await post.save();

    await recordAudit(req, {
      action: 'blog.update',
      resourceType: 'BlogPost',
      resourceId: post._id,
      details: { title: post.title },
    });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function deleteBlogPost(req, res, next) {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, isDeleted: false });
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Blog post not found.' },
      });
    }

    post.isDeleted = true;
    await post.save();

    await recordAudit(req, {
      action: 'blog.delete',
      resourceType: 'BlogPost',
      resourceId: post._id,
      details: { title: post.title },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Blog post moved to trash.' },
    });
  } catch (error) {
    next(error);
  }
}
