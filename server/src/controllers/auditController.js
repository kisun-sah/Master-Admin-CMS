import { AuditEvent } from '../models/AuditEvent.js';

export async function listAuditLogs(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.action) {
      filter.action = { $regex: req.query.action, $options: 'i' };
    }
    if (req.query.resourceType) {
      filter.resourceType = req.query.resourceType;
    }
    if (req.query.actorEmail) {
      filter.actorEmail = { $regex: req.query.actorEmail, $options: 'i' };
    }

    const [total, logs] = await Promise.all([
      AuditEvent.countDocuments(filter),
      AuditEvent.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
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
