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

const jobVacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
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
    department: {
      type: String,
      default: 'General',
      trim: true,
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
      default: 'full-time',
      index: true,
    },
    location: {
      type: String,
      default: 'Headquarters',
      trim: true,
    },
    workMode: {
      type: String,
      enum: ['on-site', 'hybrid', 'remote'],
      default: 'on-site',
      index: true,
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, 'Number of openings must be at least 1'],
    },
    experience: {
      type: String,
      default: '',
      trim: true,
    },
    education: {
      type: String,
      default: '',
      trim: true,
    },
    salaryRange: {
      type: String,
      default: '',
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Full job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },
    featuredImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'published',
      index: true,
    },
    applicationCount: {
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

// Compound indexes for public queries & listings
jobVacancySchema.index({ status: 1, isDeleted: 1, deadline: 1 });
jobVacancySchema.index({ department: 1, employmentType: 1 });

export const JobVacancy = mongoose.model('JobVacancy', jobVacancySchema);

