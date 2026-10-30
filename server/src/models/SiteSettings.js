import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global',
      unique: true,
      index: true,
    },
    siteName: {
      type: String,
      default: 'Master Corporate CMS',
      trim: true,
    },
    siteTagline: {
      type: String,
      default: 'Enterprise Web Operations & Content Engine',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    darkLogo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    defaultLanguage: {
      type: String,
      default: 'en',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    contactEmail: {
      type: String,
      default: 'contact@example.com',
      trim: true,
    },
    contactPhone: {
      type: String,
      default: '+1 (555) 019-2834',
      trim: true,
    },
    address: {
      type: String,
      default: '100 Enterprise Way, Suite 400, San Francisco, CA',
      trim: true,
    },
    mapEmbedUrl: {
      type: String,
      default: '',
      trim: true,
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    footerDescription: {
      type: String,
      default: 'Empowering modern enterprises with scalable digital solutions.',
    },
    copyrightText: {
      type: String,
      default: `© ${new Date().getFullYear()} Master CMS. All rights reserved.`,
    },
    primaryColor: {
      type: String,
      default: '#4F46E5', // Indigo token
    },
    secondaryColor: {
      type: String,
      default: '#06B6D4', // Cyan token
    },
    fontFamily: {
      type: String,
      default: 'Inter',
    },
    seoDefaults: {
      metaTitle: { type: String, default: 'Master Corporate CMS' },
      metaDescription: { type: String, default: 'Enterprise Web Operations & Content Engine' },
      defaultOgImage: { type: String, default: '' },
      defaultTwitterImage: { type: String, default: '' },
      robots: { type: String, default: 'index, follow' },
      canonicalBase: { type: String, default: 'https://example.com' },
      siteUrl: { type: String, default: 'https://example.com' },
      customRobotsTxt: { type: String, default: '' },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
