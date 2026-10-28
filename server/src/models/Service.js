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

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    icon: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    gallery: [{ type: String }],
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    ctaLabel: {
      type: String,
      default: 'Learn More',
    },
    ctaLink: {
      type: String,
      default: '',
    },
    seo: {
      type: seoSubSchema,
      default: () => ({}),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model('Service', serviceSchema);
