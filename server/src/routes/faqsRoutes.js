import express from 'express';
import {
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from '../controllers/faqsController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('faqs:read'), listFaqs);
router.post('/', requireAuth, requirePermission('faqs:manage'), createFaq);
router.put('/:id', requireAuth, requirePermission('faqs:manage'), updateFaq);
router.delete('/:id', requireAuth, requirePermission('faqs:manage'), deleteFaq);

export default router;
