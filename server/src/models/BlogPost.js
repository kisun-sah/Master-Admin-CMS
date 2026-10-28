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

const blogPostSchema = new mongoose.Schema(
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
    body: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'Admin Team',
    },
    category: {
      type: String,
      default: 'Insights',
      index: true,
    },
    tags: [{ type: String, trim: true }],
    readingTimeMinutes: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft',
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
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

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
