import { GalleryAlbum } from '../models/GalleryAlbum.js';
import { GalleryImage } from '../models/GalleryImage.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { recordAudit } from '../services/auditService.js';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------- ALBUM CONTROLLERS ----------------

export async function listAlbums(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      filter.$or = [{ title: searchRegex }, { slug: searchRegex }, { category: searchRegex }];
    }

    const sortField = req.query.sortBy || 'displayOrder';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortOrder, createdAt: -1 };

    const [total, albums] = await Promise.all([
      GalleryAlbum.countDocuments(filter),
      GalleryAlbum.find(filter)
        .populate('createdBy', 'displayName email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: albums,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAlbum(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid album ID format' },
      });
    }

    const album = await GalleryAlbum.findOne({ _id: req.params.id, isDeleted: false })
      .populate('createdBy', 'displayName email')
      .populate('updatedBy', 'displayName email');

    if (!album) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gallery album not found' },
      });
    }

    // Also fetch associated images
    const images = await GalleryImage.find({ album: album._id, isDeleted: false }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        ...album.toObject(),
        images,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createAlbum(req, res, next) {
  try {
    const { title, slug, description, coverImage, category, eventDate, displayOrder, status, seo } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Album title is required.' },
      });
    }

    const normalizedSlug = slug ? generateSlug(slug) : generateSlug(title);
    if (!normalizedSlug) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'A valid slug is required.' },
      });
    }

    const existingSlug = await GalleryAlbum.findOne({ slug: normalizedSlug, isDeleted: false });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_SLUG',
          message: `The album slug '${normalizedSlug}' is already in use.`,
        },
      });
    }

    const album = await GalleryAlbum.create({
      title: title.trim(),
      slug: normalizedSlug,
      description: description ? description.trim() : '',
      coverImage: coverImage || '',
      category: category || 'Events',
      eventDate: eventDate ? new Date(eventDate) : null,
      displayOrder: parseInt(displayOrder, 10) || 0,
      status: status || 'published',
      seo: seo || {},
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    await recordAudit(req, {
      action: 'gallery.album_create',
      resourceType: 'GalleryAlbum',
      resourceId: album._id,
      details: { title: album.title, slug: album.slug },
    });

    res.status(201).json({ success: true, data: album });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SLUG', message: 'Gallery album slug already exists.' },
      });
    }
    next(error);
  }
}

export async function updateAlbum(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid album ID' },
      });
    }

    const album = await GalleryAlbum.findOne({ _id: req.params.id, isDeleted: false });
    if (!album) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gallery album not found' },
      });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.imageCount;
    delete updates.isDeleted;

    if (updates.slug && updates.slug !== album.slug) {
      const normalizedSlug = generateSlug(updates.slug);
      const conflict = await GalleryAlbum.findOne({
        slug: normalizedSlug,
        _id: { $ne: album._id },
        isDeleted: false,
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          error: { code: 'DUPLICATE_SLUG', message: `Slug '${normalizedSlug}' is already taken.` },
        });
      }
      updates.slug = normalizedSlug;
    }

    if (updates.eventDate) {
      updates.eventDate = new Date(updates.eventDate);
    }

    updates.updatedBy = req.user?._id;
    Object.assign(album, updates);
    await album.save();

    // If album title changed, update snapshot in associated images
    if (updates.title) {
      await GalleryImage.updateMany({ album: album._id }, { albumTitle: updates.title });
    }

    await recordAudit(req, {
      action: 'gallery.album_update',
      resourceType: 'GalleryAlbum',
      resourceId: album._id,
      details: { title: album.title, status: album.status },
    });

    res.status(200).json({ success: true, data: album });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SLUG', message: 'Gallery album slug already exists.' },
      });
    }
    next(error);
  }
}

export async function updateAlbumStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Status must be draft or published.' },
      });
    }

    const album = await GalleryAlbum.findOne({ _id: req.params.id, isDeleted: false });
    if (!album) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gallery album not found' },
      });
    }

    album.status = status;
    album.updatedBy = req.user?._id;
    await album.save();

    await recordAudit(req, {
      action: 'gallery.album_status',
      resourceType: 'GalleryAlbum',
      resourceId: album._id,
      details: { status },
    });

    res.status(200).json({ success: true, data: album });
  } catch (error) {
    next(error);
  }
}

export async function deleteAlbum(req, res, next) {
  try {
    const album = await GalleryAlbum.findOne({ _id: req.params.id, isDeleted: false });
    if (!album) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gallery album not found' },
      });
    }

    // Soft-delete album and detach images safely to prevent data loss
    album.isDeleted = true;
    album.status = 'draft';
    album.updatedBy = req.user?._id;
    await album.save();

    // Detach associated images to become standalone gallery items
    const detached = await GalleryImage.updateMany(
      { album: album._id },
      { album: null, albumTitle: '' }
    );

    await recordAudit(req, {
      action: 'gallery.album_delete',
      resourceType: 'GalleryAlbum',
      resourceId: album._id,
      details: { title: album.title, detachedImages: detached.modifiedCount },
    });

    res.status(200).json({
      success: true,
      data: {
        message: `Album deleted. ${detached.modifiedCount} images preserved as standalone gallery assets.`,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ---------------- IMAGE CONTROLLERS ----------------

export async function listImages(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 24));
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (req.query.album) {
      if (req.query.album === 'standalone') {
        filter.album = null;
      } else if (mongoose.Types.ObjectId.isValid(req.query.album)) {
        filter.album = req.query.album;
      }
    }

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { caption: searchRegex },
        { altText: searchRegex },
        { albumTitle: searchRegex },
      ];
    }

    const sortField = req.query.sortBy || 'displayOrder';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortOrder, createdAt: -1 };

    const [total, images] = await Promise.all([
      GalleryImage.countDocuments(filter),
      GalleryImage.find(filter)
        .populate('album', 'title slug category coverImage')
        .populate('uploadedBy', 'displayName email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: images,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadGalleryImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'FILE_REQUIRED', message: 'No image files provided for upload.' },
      });
    }

    const { albumId, category, status } = req.body;
    let album = null;
    if (albumId && mongoose.Types.ObjectId.isValid(albumId)) {
      album = await GalleryAlbum.findOne({ _id: albumId, isDeleted: false });
    }

    const createdImages = [];

    for (const file of req.files) {
      const imageUrl = `/uploads/${file.filename}`;

      // 1. Register in MediaAsset collection for unified media management
      const mediaAsset = await MediaAsset.create({
        filename: file.filename,
        originalName: file.originalname,
        storageKey: file.filename,
        url: imageUrl,
        mimeType: file.mimetype,
        mediaType: 'image',
        size: file.size,
        uploader: req.user?._id,
        uploaderEmail: req.user?.email || '',
        referencesCount: 1,
      });

      // 2. Create GalleryImage entry
      const galleryImage = await GalleryImage.create({
        title: file.originalname.replace(/\.[^/.]+$/, ''),
        altText: file.originalname.replace(/\.[^/.]+$/, ''),
        imageUrl,
        storageKey: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        album: album ? album._id : null,
        albumTitle: album ? album.title : '',
        category: category || (album ? album.category : 'General'),
        status: status || 'published',
        uploadedBy: req.user?._id,
      });

      createdImages.push(galleryImage);
    }

    // Update album imageCount
    if (album) {
      const count = await GalleryImage.countDocuments({ album: album._id, isDeleted: false });
      album.imageCount = count;
      if (!album.coverImage && createdImages.length > 0) {
        album.coverImage = createdImages[0].imageUrl;
      }
      await album.save();
    }

    await recordAudit(req, {
      action: 'gallery.images_upload',
      resourceType: 'GalleryImage',
      details: {
        count: createdImages.length,
        albumId: album ? album._id : null,
      },
    });

    res.status(201).json({
      success: true,
      data: createdImages,
    });
  } catch (error) {
    next(error);
  }
}

export async function addImageFromMedia(req, res, next) {
  try {
    const { mediaAssetId, albumId, title, altText, caption, category, displayOrder, status } =
      req.body;

    let media = null;
    if (mediaAssetId && mongoose.Types.ObjectId.isValid(mediaAssetId)) {
      media = await MediaAsset.findById(mediaAssetId);
    }

    let album = null;
    if (albumId && mongoose.Types.ObjectId.isValid(albumId)) {
      album = await GalleryAlbum.findOne({ _id: albumId, isDeleted: false });
    }

    const imageUrl = req.body.imageUrl || (media ? media.url : null);
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Image URL or Media Asset is required.' },
      });
    }

    const galleryImage = await GalleryImage.create({
      title: title || (media ? media.originalName : 'Gallery Image'),
      altText: altText || '',
      caption: caption || '',
      imageUrl,
      storageKey: media ? media.storageKey : path.basename(imageUrl),
      originalName: media ? media.originalName : '',
      mimeType: media ? media.mimeType : 'image/jpeg',
      size: media ? media.size : 0,
      album: album ? album._id : null,
      albumTitle: album ? album.title : '',
      category: category || (album ? album.category : 'General'),
      displayOrder: parseInt(displayOrder, 10) || 0,
      status: status || 'published',
      uploadedBy: req.user?._id,
    });

    if (album) {
      const count = await GalleryImage.countDocuments({ album: album._id, isDeleted: false });
      album.imageCount = count;
      if (!album.coverImage) album.coverImage = imageUrl;
      await album.save();
    }

    await recordAudit(req, {
      action: 'gallery.image_add',
      resourceType: 'GalleryImage',
      resourceId: galleryImage._id,
      details: { title: galleryImage.title },
    });

    res.status(201).json({ success: true, data: galleryImage });
  } catch (error) {
    next(error);
  }
}

export async function updateImage(req, res, next) {
  try {
    const image = await GalleryImage.findOne({ _id: req.params.id, isDeleted: false });
    if (!image) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gallery image not found' },
      });
    }

    const { title, altText, caption, description, albumId, category, displayOrder, status } =
      req.body;

    if (title !== undefined) image.title = title.trim();
    if (altText !== undefined) image.altText = altText.trim();
    if (caption !== undefined) image.caption = caption.trim();
    if (description !== undefined) image.description = description.trim();
    if (category !== undefined) image.category = category.trim();
    if (displayOrder !== undefined) image.displayOrder = parseInt(displayOrder, 10) || 0;
    if (status !== undefined) image.status = status;

    // Handle album reassignment
    const previousAlbumId = image.album;
    if (albumId !== undefined) {
      if (albumId && mongoose.Types.ObjectId.isValid(albumId)) {
        const newAlbum = await GalleryAlbum.findOne({ _id: albumId, isDeleted: false });
        if (newAlbum) {
          image.album = newAlbum._id;
          image.albumTitle = newAlbum.title;
        }
      } else {
        image.album = null;
        image.albumTitle = '';
      }
    }

    await image.save();

    // Recalculate counts if album changed
    if (previousAlbumId && String(previousAlbumId) !== String(image.album)) {
      const oldCount = await GalleryImage.countDocuments({ album: previousAlbumId, isDeleted: false });
      await GalleryAlbum.findByIdAndUpdate(previousAlbumId, { imageCount: oldCount });
    }
    if (image.album && String(previousAlbumId) !== String(image.album)) {
      const newCount = await GalleryImage.countDocuments({ album: image.album, isDeleted: false });
      await GalleryAlbum.findByIdAndUpdate(image.album, { imageCount: newCount });
    }

    await recordAudit(req, {
      action: 'gallery.image_update',
      resourceType: 'GalleryImage',
      resourceId: image._id,
      details: { title: image.title },
    });

    res.status(200).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
}

export async function reorderImages(req, res, next) {
  try {
    const { items } = req.body; // Array of { id, displayOrder }
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Items array is required' },
      });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { displayOrder: parseInt(item.displayOrder, 10) || 0 },
      },
    }));

    await GalleryImage.bulkWrite(bulkOps);

    res.status(200).json({ success: true, data: { message: 'Display order updated successfully' } });
  } catch (error) {
    next(error);
  }
}

export async function deleteImage(req, res, next) {
  try {
    const image = await GalleryImage.findOne({ _id: req.params.id, isDeleted: false });
    if (!image) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gallery image not found' },
      });
    }

    const albumId = image.album;
    await GalleryImage.findByIdAndDelete(image._id);

    // Update album count
    if (albumId) {
      const count = await GalleryImage.countDocuments({ album: albumId, isDeleted: false });
      await GalleryAlbum.findByIdAndUpdate(albumId, { imageCount: count });
    }

    await recordAudit(req, {
      action: 'gallery.image_delete',
      resourceType: 'GalleryImage',
      resourceId: image._id,
      details: { title: image.title },
    });

    res.status(200).json({ success: true, data: { message: 'Image deleted from gallery.' } });
  } catch (error) {
    next(error);
  }
}

// ---------------- PUBLIC READ-ONLY APIS ----------------

export async function getPublicGallery(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;

    const filter = { status: 'published', isDeleted: false };
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    const [total, albums] = await Promise.all([
      GalleryAlbum.countDocuments(filter),
      GalleryAlbum.find(filter)
        .select('title slug description coverImage category eventDate imageCount displayOrder seo')
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: albums,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicAlbumBySlug(req, res, next) {
  try {
    const album = await GalleryAlbum.findOne({
      slug: req.params.slug,
      status: 'published',
      isDeleted: false,
    }).select('title slug description coverImage category eventDate imageCount seo');

    if (!album) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gallery album not found.' },
      });
    }

    const images = await GalleryImage.find({
      album: album._id,
      status: 'published',
      isDeleted: false,
    })
      .select('title altText caption description imageUrl displayOrder category createdAt')
      .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...album.toObject(),
        images,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicGalleryImages(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 24));
    const skip = (page - 1) * limit;

    const filter = { status: 'published', isDeleted: false };
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    const [total, images] = await Promise.all([
      GalleryImage.countDocuments(filter),
      GalleryImage.find(filter)
        .select('title altText caption description imageUrl displayOrder category albumTitle createdAt')
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: images,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

