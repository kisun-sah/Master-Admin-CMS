import express from 'express';
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialsController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('testimonials:read'), listTestimonials);
router.post('/', requireAuth, requirePermission('testimonials:manage'), createTestimonial);
router.put('/:id', requireAuth, requirePermission('testimonials:manage'), updateTestimonial);
router.delete('/:id', requireAuth, requirePermission('testimonials:manage'), deleteTestimonial);

export default router;
