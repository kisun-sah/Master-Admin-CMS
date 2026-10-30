import express from 'express';
import {
  listAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  updateAlbumStatus,
  deleteAlbum,
  listImages,
  uploadGalleryImages,
  addImageFromMedia,
  updateImage,
  reorderImages,
  deleteImage,
} from '../controllers/galleryController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Albums
router.get('/albums', requireAuth, requirePermission('gallery:read'), listAlbums);
router.post('/albums', requireAuth, requirePermission('gallery:manage'), createAlbum);
router.get('/albums/:id', requireAuth, requirePermission('gallery:read'), getAlbum);
router.put('/albums/:id', requireAuth, requirePermission('gallery:manage'), updateAlbum);
router.patch('/albums/:id/status', requireAuth, requirePermission('gallery:manage'), updateAlbumStatus);
router.delete('/albums/:id', requireAuth, requirePermission('gallery:manage'), deleteAlbum);

// Images
router.get('/images', requireAuth, requirePermission('gallery:read'), listImages);
router.post(
  '/images/upload',
  requireAuth,
  requirePermission('gallery:manage'),
  upload.array('images', 20),
  uploadGalleryImages
);
router.post('/images', requireAuth, requirePermission('gallery:manage'), addImageFromMedia);
router.patch('/images/reorder', requireAuth, requirePermission('gallery:manage'), reorderImages);
router.put('/images/:id', requireAuth, requirePermission('gallery:manage'), updateImage);
router.delete('/images/:id', requireAuth, requirePermission('gallery:manage'), deleteImage);

export default router;

