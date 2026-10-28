import express from 'express';
import { uploadMedia, listMedia, updateMedia, deleteMedia } from '../controllers/mediaController.js';
import { upload } from '../middleware/upload.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('media:read'), listMedia);
router.post('/upload', requireAuth, requirePermission('media:create'), upload.array('files', 10), uploadMedia);
router.put('/:id', requireAuth, requirePermission('media:create'), updateMedia);
router.delete('/:id', requireAuth, requirePermission('media:delete'), deleteMedia);

export default router;
