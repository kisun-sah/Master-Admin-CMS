import { Partner } from '../models/Partner.js';
import { recordAudit } from '../services/auditService.js';

export async function listPartners(req, res, next) {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    const partners = await Partner.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    next(error);
  }
}

export async function createPartner(req, res, next) {
  try {
    const { name, logo, websiteUrl, altText, order, status } = req.body;

    if (!name || !logo) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Partner name and logo are required.' },
      });
    }

    const partner = await Partner.create({
      name: name.trim(),
      logo,
      websiteUrl: websiteUrl || '',
      altText: altText || name,
      order: Number(order) || 0,
      status: status || 'active',
    });

    await recordAudit(req, {
      action: 'partner.create',
      resourceType: 'Partner',
      resourceId: partner._id,
      details: { name: partner.name },
    });

    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    next(error);
  }
}

export async function updatePartner(req, res, next) {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Partner not found.' },
      });
    }

    const { name, logo, websiteUrl, altText, order, status } = req.body;

    if (name) partner.name = name.trim();
    if (logo) partner.logo = logo;
    if (websiteUrl !== undefined) partner.websiteUrl = websiteUrl;
    if (altText !== undefined) partner.altText = altText;
    if (order !== undefined) partner.order = Number(order);
    if (status) partner.status = status;

    await partner.save();

    await recordAudit(req, {
      action: 'partner.update',
      resourceType: 'Partner',
      resourceId: partner._id,
      details: { name: partner.name },
    });

    res.status(200).json({ success: true, data: partner });
  } catch (error) {
    next(error);
  }
}

export async function deletePartner(req, res, next) {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Partner not found.' },
      });
    }

    await recordAudit(req, {
      action: 'partner.delete',
      resourceType: 'Partner',
      resourceId: req.params.id,
      details: { name: partner.name },
    });

    res.status(200).json({ success: true, data: { message: 'Partner deleted successfully.' } });
  } catch (error) {
    next(error);
  }
}
