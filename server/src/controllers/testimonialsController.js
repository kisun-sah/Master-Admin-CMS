import { Testimonial } from '../models/Testimonial.js';
import { recordAudit } from '../services/auditService.js';

export async function listTestimonials(req, res, next) {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    const list = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
}

export async function createTestimonial(req, res, next) {
  try {
    const { clientName, clientRole, company, avatar, rating, quote, order, status, featured } = req.body;

    if (!clientName || !quote) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Client name and quote are required.' },
      });
    }

    const item = await Testimonial.create({
      clientName: clientName.trim(),
      clientRole: clientRole || '',
      company: company || '',
      avatar: avatar || '',
      rating: Number(rating) || 5,
      quote: quote.trim(),
      order: Number(order) || 0,
      status: status || 'published',
      featured: !!featured,
    });

    await recordAudit(req, {
      action: 'testimonial.create',
      resourceType: 'Testimonial',
      resourceId: item._id,
      details: { clientName: item.clientName },
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function updateTestimonial(req, res, next) {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Testimonial not found.' },
      });
    }

    const { clientName, clientRole, company, avatar, rating, quote, order, status, featured } = req.body;

    if (clientName) item.clientName = clientName.trim();
    if (clientRole !== undefined) item.clientRole = clientRole;
    if (company !== undefined) item.company = company;
    if (avatar !== undefined) item.avatar = avatar;
    if (rating !== undefined) item.rating = Number(rating);
    if (quote) item.quote = quote.trim();
    if (order !== undefined) item.order = Number(order);
    if (status) item.status = status;
    if (featured !== undefined) item.featured = featured;

    await item.save();

    await recordAudit(req, {
      action: 'testimonial.update',
      resourceType: 'Testimonial',
      resourceId: item._id,
      details: { clientName: item.clientName },
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function deleteTestimonial(req, res, next) {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Testimonial not found.' },
      });
    }

    await recordAudit(req, {
      action: 'testimonial.delete',
      resourceType: 'Testimonial',
      resourceId: req.params.id,
      details: { clientName: item.clientName },
    });

    res.status(200).json({ success: true, data: { message: 'Testimonial deleted successfully.' } });
  } catch (error) {
    next(error);
  }
}
