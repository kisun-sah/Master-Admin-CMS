import { Service } from '../models/Service.js';
import { recordAudit } from '../services/auditService.js';

export async function listServices(req, res, next) {
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
        { shortDescription: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [total, services] = await Promise.all([
      Service.countDocuments(filter),
      Service.find(filter).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: services,
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

export async function getServiceById(req, res, next) {
  try {
    const service = await Service.findOne({ _id: req.params.id, isDeleted: false });
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found.' },
      });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
}

export async function createService(req, res, next) {
  try {
    const { title, slug, icon, featuredImage, gallery, shortDescription, content, category, order, status, featured, ctaLabel, ctaLink, seo } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Service title is required.' },
      });
    }

    const normalizedSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
      .toLowerCase()
      .trim();

    const existing = await Service.findOne({ slug: normalizedSlug, isDeleted: false });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: `Service with slug '${normalizedSlug}' already exists.` },
      });
    }

    const service = await Service.create({
      title: title.trim(),
      slug: normalizedSlug,
      icon: icon || '',
      featuredImage: featuredImage || '',
      gallery: gallery || [],
      shortDescription: shortDescription || '',
      content: content || '',
      category: category || 'General',
      order: order || 0,
      status: status || 'published',
      featured: !!featured,
      ctaLabel: ctaLabel || 'Learn More',
      ctaLink: ctaLink || '',
      seo: seo || {},
    });

    await recordAudit(req, {
      action: 'service.create',
      resourceType: 'Service',
      resourceId: service._id,
      details: { title: service.title },
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    const service = await Service.findOne({ _id: req.params.id, isDeleted: false });
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found.' },
      });
    }

    const { title, slug, icon, featuredImage, gallery, shortDescription, content, category, order, status, featured, ctaLabel, ctaLink, seo } = req.body;

    if (slug && slug !== service.slug) {
      const normalizedSlug = slug.toLowerCase().trim();
      const conflict = await Service.findOne({
        slug: normalizedSlug,
        _id: { $ne: service._id },
        isDeleted: false,
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          error: { code: 'CONFLICT', message: `Slug '${normalizedSlug}' is already in use.` },
        });
      }
      service.slug = normalizedSlug;
    }

    if (title) service.title = title.trim();
    if (icon !== undefined) service.icon = icon;
    if (featuredImage !== undefined) service.featuredImage = featuredImage;
    if (gallery !== undefined) service.gallery = gallery;
    if (shortDescription !== undefined) service.shortDescription = shortDescription;
    if (content !== undefined) service.content = content;
    if (category !== undefined) service.category = category;
    if (order !== undefined) service.order = order;
    if (status !== undefined) service.status = status;
    if (featured !== undefined) service.featured = featured;
    if (ctaLabel !== undefined) service.ctaLabel = ctaLabel;
    if (ctaLink !== undefined) service.ctaLink = ctaLink;
    if (seo !== undefined) service.seo = seo;

    await service.save();

    await recordAudit(req, {
      action: 'service.update',
      resourceType: 'Service',
      resourceId: service._id,
      details: { title: service.title },
    });

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req, res, next) {
  try {
    const service = await Service.findOne({ _id: req.params.id, isDeleted: false });
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found.' },
      });
    }

    service.isDeleted = true;
    await service.save();

    await recordAudit(req, {
      action: 'service.delete',
      resourceType: 'Service',
      resourceId: service._id,
      details: { title: service.title },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Service deleted successfully.' },
    });
  } catch (error) {
    next(error);
  }
}
