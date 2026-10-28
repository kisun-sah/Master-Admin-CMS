import express from 'express';
import { getSystemHealth, generateBackup, restoreBackup } from '../controllers/systemController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();
router.get('/health', requireAuth, requirePermission('system:read'), getSystemHealth);
router.get('/backup', requireAuth, requirePermission('system:read'), generateBackup);
router.post('/restore', requireAuth, requirePermission('system:read'), restoreBackup);

export default router;

