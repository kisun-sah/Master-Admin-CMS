import express from 'express';
import { listAuditLogs } from '../controllers/auditController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();
router.get('/', requireAuth, requirePermission('audit:read'), listAuditLogs);

export default router;
