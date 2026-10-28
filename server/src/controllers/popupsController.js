import { Popup } from '../models/Popup.js';
import { recordAudit } from '../services/auditService.js';

export async function listPopups(req, res, next) {
  try {
    const popups = await Popup.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: popups });
  } catch (error) {
    next(error);
  }
}

export async function createPopup(req, res, next) {
  try {
    const { title, content, mediaUrl, ctaText, ctaLink, status, frequency, startDate, endDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Popup title is required.' },
      });
    }

    const popup = await Popup.create({
      title: title.trim(),
      content: content || '',
      mediaUrl: mediaUrl || '',
      ctaText: ctaText || '',
      ctaLink: ctaLink || '',
      status: status || 'inactive',
      frequency: frequency || 'once_per_session',
      startDate: startDate || null,
      endDate: endDate || null,
    });

    await recordAudit(req, {
      action: 'popup.create',
      resourceType: 'Popup',
      resourceId: popup._id,
      details: { title: popup.title },
    });

    res.status(201).json({ success: true, data: popup });
  } catch (error) {
    next(error);
  }
}

export async function updatePopup(req, res, next) {
  try {
    const popup = await Popup.findById(req.params.id);
    if (!popup) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Popup not found.' },
      });
    }

    const { title, content, mediaUrl, ctaText, ctaLink, status, frequency, startDate, endDate } = req.body;

    if (title) popup.title = title.trim();
    if (content !== undefined) popup.content = content;
    if (mediaUrl !== undefined) popup.mediaUrl = mediaUrl;
    if (ctaText !== undefined) popup.ctaText = ctaText;
    if (ctaLink !== undefined) popup.ctaLink = ctaLink;
    if (status) popup.status = status;
    if (frequency) popup.frequency = frequency;
    if (startDate !== undefined) popup.startDate = startDate;
    if (endDate !== undefined) popup.endDate = endDate;

    await popup.save();

    await recordAudit(req, {
      action: 'popup.update',
      resourceType: 'Popup',
      resourceId: popup._id,
      details: { title: popup.title },
    });

    res.status(200).json({ success: true, data: popup });
  } catch (error) {
    next(error);
  }
}

export async function deletePopup(req, res, next) {
  try {
    const popup = await Popup.findByIdAndDelete(req.params.id);
    if (!popup) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Popup not found.' },
      });
    }

    await recordAudit(req, {
      action: 'popup.delete',
      resourceType: 'Popup',
      resourceId: req.params.id,
      details: { title: popup.title },
    });

    res.status(200).json({ success: true, data: { message: 'Popup deleted successfully.' } });
  } catch (error) {
    next(error);
  }
}

export async function getActivePublicPopup(req, res, next) {
  try {
    const now = new Date();
    const popup = await Popup.findOne({
      status: 'active',
      $or: [{ startDate: null }, { startDate: { $lte: now } }],
      $and: [{ $or: [{ endDate: null }, { endDate: { $gte: now } }] }],
    });

    res.status(200).json({
      success: true,
      data: popup || null,
    });
  } catch (error) {
    next(error);
  }
}
