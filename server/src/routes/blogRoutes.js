import express from 'express';
import {
  listBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('blogs:read'), listBlogPosts);
router.get('/:id', requireAuth, requirePermission('blogs:read'), getBlogPostById);
router.post('/', requireAuth, requirePermission('blogs:create'), createBlogPost);
router.put('/:id', requireAuth, requirePermission('blogs:update'), updateBlogPost);
router.delete('/:id', requireAuth, requirePermission('blogs:delete'), deleteBlogPost);

export default router;
