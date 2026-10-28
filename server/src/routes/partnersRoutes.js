import express from 'express';
import {
  listPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from '../controllers/partnersController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('partners:read'), listPartners);
router.post('/', requireAuth, requirePermission('partners:manage'), createPartner);
router.put('/:id', requireAuth, requirePermission('partners:manage'), updatePartner);
router.delete('/:id', requireAuth, requirePermission('partners:manage'), deletePartner);

export default router;
