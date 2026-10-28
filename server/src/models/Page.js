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

const pageBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['hero', 'rich_text', 'features', 'cta', 'stats', 'faq', 'testimonials', 'image_gallery', 'spacer'],
    },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    mediaUrl: { type: String, default: '' },
    buttonText: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    items: [{ type: mongoose.Schema.Types.Mixed }],
    order: { type: Number, default: 0 },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: true }
);

const pageSchema = new mongoose.Schema(
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
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    featuredImage: {
      type: String,
      default: '',
    },
    blocks: [pageBlockSchema],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    placement: {
      showInHeader: { type: Boolean, default: false },
      showInFooter: { type: Boolean, default: false },
      isHomepage: { type: Boolean, default: false },
    },
    layout: {
      type: String,
      enum: ['default', 'landing', 'full_width', 'sidebar'],
      default: 'default',
    },
    seo: {
      type: seoSubSchema,
      default: () => ({}),
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export const Page = mongoose.model('Page', pageSchema);
