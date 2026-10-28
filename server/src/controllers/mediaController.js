import fs from 'fs';
import path from 'path';
import { MediaAsset } from '../models/MediaAsset.js';
import { Page } from '../models/Page.js';
import { Service } from '../models/Service.js';
import { BlogPost } from '../models/BlogPost.js';
import { Slider } from '../models/Slider.js';
import { recordAudit } from '../services/auditService.js';

export async function uploadMedia(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'FILE_REQUIRED', message: 'No file was uploaded.' },
      });
    }

    const createdAssets = [];

    for (const file of req.files) {
      let mediaType = 'image';
      if (file.mimetype.startsWith('video/')) {
        mediaType = 'video';
      } else if (file.mimetype === 'application/pdf') {
        mediaType = 'document';
      }

      const assetUrl = `/uploads/${file.filename}`;

      const asset = await MediaAsset.create({
        filename: file.filename,
        originalName: file.originalname,
        storageKey: file.path,
        url: assetUrl,
        mimeType: file.mimetype,
        mediaType,
        size: file.size,
        uploader: req.user?._id,
        uploaderEmail: req.user?.email || 'admin',
        altText: path.parse(file.originalname).name,
      });

      createdAssets.push(asset);

      await recordAudit(req, {
        action: 'media.upload',
        resourceType: 'MediaAsset',
        resourceId: asset._id,
        details: { filename: file.filename, size: file.size, mimeType: file.mimetype },
      });
    }

    res.status(201).json({
      success: true,
      data: createdAssets,
    });
  } catch (error) {
    next(error);
  }
}

export async function listMedia(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 18));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type && req.query.type !== 'all') {
      filter.mediaType = req.query.type;
    }
    if (req.query.search) {
      filter.$or = [
        { originalName: { $regex: req.query.search, $options: 'i' } },
        { altText: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [total, assets] = await Promise.all([
      MediaAsset.countDocuments(filter),
      MediaAsset.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: assets,
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

export async function updateMedia(req, res, next) {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Media asset not found.' },
      });
    }

    const { altText, caption } = req.body;
    if (altText !== undefined) asset.altText = altText.trim();
    if (caption !== undefined) asset.caption = caption.trim();

    await asset.save();

    await recordAudit(req, {
      action: 'media.update',
      resourceType: 'MediaAsset',
      resourceId: asset._id,
      details: { altText: asset.altText },
    });

    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Media asset not found.' },
      });
    }

    // Check usage references across collections
    const [pageCount, serviceCount, blogCount, sliderCount] = await Promise.all([
      Page.countDocuments({ featuredImage: asset.url }),
      Service.countDocuments({ featuredImage: asset.url }),
      BlogPost.countDocuments({ featuredImage: asset.url }),
      Slider.countDocuments({ mediaUrl: asset.url }),
    ]);

    const totalReferences = pageCount + serviceCount + blogCount + sliderCount;
    if (totalReferences > 0 && !req.query.force) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'RESOURCE_IN_USE',
          message: `Asset is referenced by ${totalReferences} content item(s). Use ?force=true to override and delete.`,
          references: { pages: pageCount, services: serviceCount, blogs: blogCount, sliders: sliderCount },
        },
      });
    }

    // Safely remove file on disk
    if (fs.existsSync(asset.storageKey)) {
      try {
        fs.unlinkSync(asset.storageKey);
      } catch (err) {
        console.warn(`[Media Warning] Could not remove physical file: ${asset.storageKey}`);
      }
    }

    await MediaAsset.findByIdAndDelete(asset._id);

    await recordAudit(req, {
      action: 'media.delete',
      resourceType: 'MediaAsset',
      resourceId: asset._id,
      details: { filename: asset.filename },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Media asset deleted successfully.' },
    });
  } catch (error) {
    next(error);
  }
}
