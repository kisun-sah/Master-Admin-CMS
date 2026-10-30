import mongoose from 'mongoose';

const seoAuditLogSchema = new mongoose.Schema(
  {
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    metadataScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    accessibilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    technicalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    totalIssues: {
      type: Number,
      default: 0,
    },
    criticalErrors: {
      type: Number,
      default: 0,
    },
    warnings: {
      type: Number,
      default: 0,
    },
    recommendations: {
      type: Number,
      default: 0,
    },
    breakdown: {
      pages: { total: Number, issues: Number },
      services: { total: Number, issues: Number },
      blogs: { total: Number, issues: Number },
      media: { total: Number, issues: Number },
    },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

seoAuditLogSchema.index({ createdAt: -1 });

export const SeoAuditLog = mongoose.model('SeoAuditLog', seoAuditLogSchema);
