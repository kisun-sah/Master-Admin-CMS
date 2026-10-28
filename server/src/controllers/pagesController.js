import { Page } from '../models/Page.js';
import { recordAudit } from '../services/auditService.js';

export async function listPages(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { slug: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const sortField = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [total, pages] = await Promise.all([
      Page.countDocuments(filter),
      Page.find(filter)
        .select('title slug status publishDate placement layout updatedAt createdAt author')
        .populate('author', 'displayName email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: pages,
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

export async function getPageById(req, res, next) {
  try {
    const page = await Page.findOne({ _id: req.params.id, isDeleted: false }).populate(
      'author',
      'displayName email'
    );
    if (!page) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Page not found.' },
      });
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicPageBySlug(req, res, next) {
  try {
    const page = await Page.findOne({
      slug: req.params.slug.toLowerCase().trim(),
      status: 'published',
      isDeleted: false,
    }).select('-isDeleted');

    if (!page) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Published page not found.' },
      });
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
}

export async function createPage(req, res, next) {
  try {
    const { title, slug, excerpt, featuredImage, blocks, placement, layout, seo, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Page title is required.' },
      });
    }

    const normalizedSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
      .toLowerCase()
      .trim();

    const existing = await Page.findOne({ slug: normalizedSlug, isDeleted: false });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: `A page with slug '${normalizedSlug}' already exists.` },
      });
    }

    const newPage = await Page.create({
      title: title.trim(),
      slug: normalizedSlug,
      excerpt: excerpt || '',
      featuredImage: featuredImage || '',
      blocks: blocks || [],
      placement: placement || {},
      layout: layout || 'default',
      seo: seo || {},
      status: status || 'draft',
      author: req.user?._id,
    });

    await recordAudit(req, {
      action: 'page.create',
      resourceType: 'Page',
      resourceId: newPage._id,
      details: { title: newPage.title, slug: newPage.slug },
    });

    res.status(201).json({
      success: true,
      data: newPage,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePage(req, res, next) {
  try {
    const page = await Page.findOne({ _id: req.params.id, isDeleted: false });
    if (!page) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Page not found.' },
      });
    }

    const { title, slug, excerpt, featuredImage, blocks, placement, layout, seo, status } = req.body;

    if (slug && slug !== page.slug) {
      const normalizedSlug = slug.toLowerCase().trim();
      const conflict = await Page.findOne({
        slug: normalizedSlug,
        _id: { $ne: page._id },
        isDeleted: false,
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          error: { code: 'CONFLICT', message: `Slug '${normalizedSlug}' is already in use.` },
        });
      }
      page.slug = normalizedSlug;
    }

    if (title) page.title = title.trim();
    if (excerpt !== undefined) page.excerpt = excerpt;
    if (featuredImage !== undefined) page.featuredImage = featuredImage;
    if (blocks !== undefined) page.blocks = blocks;
    if (placement !== undefined) page.placement = placement;
    if (layout !== undefined) page.layout = layout;
    if (seo !== undefined) page.seo = seo;
    if (status) page.status = status;

    await page.save();

    await recordAudit(req, {
      action: 'page.update',
      resourceType: 'Page',
      resourceId: page._id,
      details: { title: page.title, slug: page.slug },
    });

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
}

export async function publishPage(req, res, next) {
  try {
    const page = await Page.findOne({ _id: req.params.id, isDeleted: false });
    if (!page) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Page not found.' },
      });
    }

    const { status } = req.body;
    page.status = status || (page.status === 'published' ? 'draft' : 'published');
    if (page.status === 'published') {
      page.publishDate = new Date();
    }
    await page.save();

    await recordAudit(req, {
      action: `page.${page.status}`,
      resourceType: 'Page',
      resourceId: page._id,
      details: { title: page.title, status: page.status },
    });

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePage(req, res, next) {
  try {
    const page = await Page.findOne({ _id: req.params.id, isDeleted: false });
    if (!page) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Page not found.' },
      });
    }

    // Soft delete to preserve recoverability
    page.isDeleted = true;
    await page.save();

    await recordAudit(req, {
      action: 'page.delete',
      resourceType: 'Page',
      resourceId: page._id,
      details: { title: page.title },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Page moved to trash successfully.' },
    });
  } catch (error) {
    next(error);
  }
}
