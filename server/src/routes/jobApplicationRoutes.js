import express from 'express';
import {
  listApplications,
  getApplication,
  updateApplicationStatus,
  addApplicationNote,
  downloadApplicationCv,
  exportApplicationsCsv,
  deleteApplication,
} from '../controllers/jobApplicationController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('jobapplications:read'), listApplications);
router.get('/export/csv', requireAuth, requirePermission('jobapplications:read'), exportApplicationsCsv);
router.get('/:id', requireAuth, requirePermission('jobapplications:read'), getApplication);
router.patch('/:id/status', requireAuth, requirePermission('jobapplications:manage'), updateApplicationStatus);
router.patch('/:id/notes', requireAuth, requirePermission('jobapplications:manage'), addApplicationNote);
router.get('/:id/cv', requireAuth, requirePermission('jobapplications:download_cv'), downloadApplicationCv);
router.delete('/:id', requireAuth, requirePermission('jobapplications:manage'), deleteApplication);

export default router;

