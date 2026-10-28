import express from 'express';
import {
  listPages,
  getPageById,
  createPage,
  updatePage,
  publishPage,
  deletePage,
} from '../controllers/pagesController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('pages:read'), listPages);
router.get('/:id', requireAuth, requirePermission('pages:read'), getPageById);
router.post('/', requireAuth, requirePermission('pages:create'), createPage);
router.put('/:id', requireAuth, requirePermission('pages:update'), updatePage);
router.patch('/:id/publish', requireAuth, requirePermission('pages:publish'), publishPage);
router.delete('/:id', requireAuth, requirePermission('pages:delete'), deletePage);

export default router;
