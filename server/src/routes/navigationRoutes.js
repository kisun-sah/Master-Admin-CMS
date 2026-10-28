import express from 'express';
import { listMenus, getMenuByLocation, updateMenu } from '../controllers/navigationController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('menus:read'), listMenus);
router.get('/:location', requireAuth, requirePermission('menus:read'), getMenuByLocation);
router.put('/:location', requireAuth, requirePermission('menus:manage'), updateMenu);

export default router;
