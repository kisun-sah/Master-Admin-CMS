import mongoose from 'mongoose';

const seoSubSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    robots: { type: String, default: 'index, follow' },
    ogTitle: { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    structuredData: { type: String, default: '' },
  },
  { _id: false }
);

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Events',
      trim: true,
      index: true,
    },
    eventDate: {
      type: Date,
      default: null,
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
    imageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    seo: {
      type: seoSubSchema,
      default: () => ({}),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
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

galleryAlbumSchema.index({ status: 1, isDeleted: 1, displayOrder: 1 });

export const GalleryAlbum = mongoose.model('GalleryAlbum', galleryAlbumSchema);

