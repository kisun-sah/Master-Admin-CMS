import { Slider } from '../models/Slider.js';
import { recordAudit } from '../services/auditService.js';

export async function listSliders(req, res, next) {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    const sliders = await Slider.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: sliders });
  } catch (error) {
    next(error);
  }
}

export async function createSlider(req, res, next) {
  try {
    const { title, subtitle, mediaType, mediaUrl, mobileMediaUrl, ctaText, ctaLink, order, status, startDate, endDate } = req.body;

    if (!title || !mediaUrl) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Slider title and media URL are required.' },
      });
    }

    const slider = await Slider.create({
      title: title.trim(),
      subtitle: subtitle || '',
      mediaType: mediaType || 'image',
      mediaUrl,
      mobileMediaUrl: mobileMediaUrl || '',
      ctaText: ctaText || 'Explore More',
      ctaLink: ctaLink || '',
      order: order || 0,
      status: status || 'active',
      startDate: startDate || null,
      endDate: endDate || null,
    });

    await recordAudit(req, {
      action: 'slider.create',
      resourceType: 'Slider',
      resourceId: slider._id,
      details: { title: slider.title },
    });

    res.status(201).json({ success: true, data: slider });
  } catch (error) {
    next(error);
  }
}

export async function updateSlider(req, res, next) {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Slider entry not found.' },
      });
    }

    const { title, subtitle, mediaType, mediaUrl, mobileMediaUrl, ctaText, ctaLink, order, status, startDate, endDate } = req.body;

    if (title) slider.title = title.trim();
    if (subtitle !== undefined) slider.subtitle = subtitle;
    if (mediaType) slider.mediaType = mediaType;
    if (mediaUrl) slider.mediaUrl = mediaUrl;
    if (mobileMediaUrl !== undefined) slider.mobileMediaUrl = mobileMediaUrl;
    if (ctaText !== undefined) slider.ctaText = ctaText;
    if (ctaLink !== undefined) slider.ctaLink = ctaLink;
    if (order !== undefined) slider.order = order;
    if (status) slider.status = status;
    if (startDate !== undefined) slider.startDate = startDate;
    if (endDate !== undefined) slider.endDate = endDate;

    await slider.save();

    await recordAudit(req, {
      action: 'slider.update',
      resourceType: 'Slider',
      resourceId: slider._id,
      details: { title: slider.title },
    });

    res.status(200).json({ success: true, data: slider });
  } catch (error) {
    next(error);
  }
}

export async function deleteSlider(req, res, next) {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Slider entry not found.' },
      });
    }

    await recordAudit(req, {
      action: 'slider.delete',
      resourceType: 'Slider',
      resourceId: req.params.id,
      details: { title: slider.title },
    });

    res.status(200).json({ success: true, data: { message: 'Slider deleted successfully.' } });
  } catch (error) {
    next(error);
  }
}
