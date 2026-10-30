import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: '',
      trim: true,
    },
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryAlbum',
      default: null,
      index: true,
    },
    albumTitle: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    storageKey: {
      type: String,
      required: [true, 'Storage key is required'],
      index: true,
    },
    originalName: {
      type: String,
      default: '',
    },
    mimeType: {
      type: String,
      default: 'image/jpeg',
    },
    size: {
      type: Number,
      default: 0,
    },
    dimensions: {
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

galleryImageSchema.index({ album: 1, status: 1, isDeleted: 1, displayOrder: 1 });

export const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

