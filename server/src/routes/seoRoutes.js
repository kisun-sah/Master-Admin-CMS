import express from 'express';
import {
  getSeoHealth,
  listRedirects,
  createRedirect,
  updateRedirect,
  deleteRedirect,
} from '../controllers/seoController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/health', requireAuth, requirePermission('seo:read'), getSeoHealth);
router.get('/redirects', requireAuth, requirePermission('seo:read'), listRedirects);
router.post('/redirects', requireAuth, requirePermission('seo:manage'), createRedirect);
router.put('/redirects/:id', requireAuth, requirePermission('seo:manage'), updateRedirect);
router.delete('/redirects/:id', requireAuth, requirePermission('seo:manage'), deleteRedirect);

export default router;
