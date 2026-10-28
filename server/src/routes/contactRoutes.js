import express from 'express';
import {
  listSubmissions,
  updateSubmission,
  deleteSubmission,
  exportCsv,
} from '../controllers/contactController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('contacts:read'), listSubmissions);
router.get('/export', requireAuth, requirePermission('contacts:export'), exportCsv);
router.put('/:id', requireAuth, requirePermission('contacts:manage'), updateSubmission);
router.delete('/:id', requireAuth, requirePermission('contacts:delete'), deleteSubmission);

export default router;
