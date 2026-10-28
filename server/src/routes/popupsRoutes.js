import express from 'express';
import {
  listPopups,
  createPopup,
  updatePopup,
  deletePopup,
} from '../controllers/popupsController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('popups:read'), listPopups);
router.post('/', requireAuth, requirePermission('popups:manage'), createPopup);
router.put('/:id', requireAuth, requirePermission('popups:manage'), updatePopup);
router.delete('/:id', requireAuth, requirePermission('popups:manage'), deletePopup);

export default router;
