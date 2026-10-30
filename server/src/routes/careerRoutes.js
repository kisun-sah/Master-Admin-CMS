import express from 'express';
import {
  listVacancies,
  getVacancy,
  createVacancy,
  updateVacancy,
  updateVacancyStatus,
  deleteVacancy,
} from '../controllers/careerController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('careers:read'), listVacancies);
router.post('/', requireAuth, requirePermission('careers:manage'), createVacancy);
router.get('/:id', requireAuth, requirePermission('careers:read'), getVacancy);
router.put('/:id', requireAuth, requirePermission('careers:manage'), updateVacancy);
router.patch('/:id/status', requireAuth, requirePermission('careers:manage'), updateVacancyStatus);
router.delete('/:id', requireAuth, requirePermission('careers:manage'), deleteVacancy);

export default router;

