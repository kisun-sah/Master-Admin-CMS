import express from 'express';
import {
  listSliders,
  createSlider,
  updateSlider,
  deleteSlider,
} from '../controllers/slidersController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('sliders:read'), listSliders);
router.post('/', requireAuth, requirePermission('sliders:manage'), createSlider);
router.put('/:id', requireAuth, requirePermission('sliders:manage'), updateSlider);
router.delete('/:id', requireAuth, requirePermission('sliders:manage'), deleteSlider);

export default router;
