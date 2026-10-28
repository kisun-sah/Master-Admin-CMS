import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('settings:read'), getSettings);
router.put('/', requireAuth, requirePermission('settings:update'), updateSettings);

export default router;
