import express from 'express';
import {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/servicesController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('services:read'), listServices);
router.get('/:id', requireAuth, requirePermission('services:read'), getServiceById);
router.post('/', requireAuth, requirePermission('services:create'), createService);
router.put('/:id', requireAuth, requirePermission('services:update'), updateService);
router.delete('/:id', requireAuth, requirePermission('services:delete'), deleteService);

export default router;
