import { AuditEvent } from '../models/AuditEvent.js';

export async function recordAudit(req, { action, resourceType, resourceId = '', details = {}, status = 'success' }) {
  try {
    const actorId = req?.user?._id || req?.session?.userId || null;
    const actorEmail = req?.user?.email || 'unauthenticated';
    const actorName = req?.user?.displayName || 'System';
    const ipAddress = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req?.headers?.['user-agent'] || 'Unknown';

    await AuditEvent.create({
      actorId,
      actorEmail,
      actorName,
      action,
      resourceType,
      resourceId: String(resourceId),
      details,
      status,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('[AuditService Error] Failed to write audit event:', error.message);
  }
}
