import express from 'express';
import {
  getSeoHealth,
  getSeoAuditHistory,
  listRedirects,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  exportRedirectsCsv,
  importRedirectsCsv,
  getGlobalSeoSettings,
  updateGlobalSeoSettings,
} from '../controllers/seoController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// SEO Dashboard & Audit
router.get('/health', requireAuth, requirePermission('seo:read'), getSeoHealth);
router.get('/trends', requireAuth, requirePermission('seo:read'), getSeoAuditHistory);

// Redirects Engine CRUD
router.get('/redirects', requireAuth, requirePermission('seo:read'), listRedirects);
router.get('/redirects/export/csv', requireAuth, requirePermission('seo:read'), exportRedirectsCsv);
router.post('/redirects/import/csv', requireAuth, requirePermission('seo:manage'), importRedirectsCsv);
router.post('/redirects', requireAuth, requirePermission('seo:manage'), createRedirect);
router.put('/redirects/:id', requireAuth, requirePermission('seo:manage'), updateRedirect);
router.delete('/redirects/:id', requireAuth, requirePermission('seo:manage'), deleteRedirect);

// Global SEO Settings
router.get('/settings', requireAuth, requirePermission('seo:read'), getGlobalSeoSettings);
router.put('/settings', requireAuth, requirePermission('seo:manage'), updateGlobalSeoSettings);

export default router;
