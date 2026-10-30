import express from 'express';
import { getPublicSettings } from '../controllers/settingsController.js';
import { getPublicPageBySlug } from '../controllers/pagesController.js';
import { Service } from '../models/Service.js';
import { BlogPost } from '../models/BlogPost.js';
import { Slider } from '../models/Slider.js';
import { Testimonial } from '../models/Testimonial.js';
import { TeamMember } from '../models/TeamMember.js';
import { Partner } from '../models/Partner.js';
import { FAQ } from '../models/FAQ.js';
import { NavigationMenu } from '../models/NavigationMenu.js';
import { getActivePublicPopup } from '../controllers/popupsController.js';
import { submitContact } from '../controllers/contactController.js';
import { generateSitemapXml, generateRobotsTxt } from '../controllers/seoController.js';
import { getPublicCareers, getPublicCareerBySlug } from '../controllers/careerController.js';
import { submitApplication } from '../controllers/jobApplicationController.js';
import {
  getPublicGallery,
  getPublicAlbumBySlug,
  getPublicGalleryImages,
} from '../controllers/galleryController.js';
import { uploadResume } from '../middleware/privateUpload.js';
import { publicApiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(publicApiRateLimiter);

// Settings
router.get('/settings', getPublicSettings);

// Navigation
router.get('/navigation', async (req, res, next) => {
  try {
    const menus = await NavigationMenu.find();
    res.status(200).json({ success: true, data: menus });
  } catch (err) {
    next(err);
  }
});

// Pages
router.get('/pages/:slug', getPublicPageBySlug);

// Services (published only)
router.get('/services', async (req, res, next) => {
  try {
    const services = await Service.find({ status: 'published', isDeleted: false })
      .select('title slug icon featuredImage shortDescription content category order ctaLabel ctaLink seo')
      .sort({ order: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
});

// Blogs (published only)
router.get('/blogs', async (req, res, next) => {
  try {
    const blogs = await BlogPost.find({ status: 'published', isDeleted: false })
      .select('title slug excerpt featuredImage authorName category tags readingTimeMinutes publishDate seo')
      .sort({ publishDate: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
});

router.get('/blogs/:slug', async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published', isDeleted: false })
      .select('-isDeleted');
    if (!post) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Article not found.' } });
    }
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// Sliders (active only)
router.get('/sliders', async (req, res, next) => {
  try {
    const now = new Date();
    const sliders = await Slider.find({
      status: 'active',
      $or: [{ startDate: null }, { startDate: { $lte: now } }],
      $and: [{ $or: [{ endDate: null }, { endDate: { $gte: now } }] }],
    }).sort({ order: 1 });
    res.status(200).json({ success: true, data: sliders });
  } catch (err) {
    next(err);
  }
});

// Testimonials (published only)
router.get('/testimonials', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: 'published' }).sort({ order: 1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
});

// Team (active only)
router.get('/team', async (req, res, next) => {
  try {
    const team = await TeamMember.find({ status: 'active' }).sort({ order: 1 });
    res.status(200).json({ success: true, data: team });
  } catch (err) {
    next(err);
  }
});

// Partners (active only)
router.get('/partners', async (req, res, next) => {
  try {
    const partners = await Partner.find({ status: 'active' }).sort({ order: 1 });
    res.status(200).json({ success: true, data: partners });
  } catch (err) {
    next(err);
  }
});

// FAQs (published only)
router.get('/faqs', async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ status: 'published' }).sort({ order: 1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
});

// Popups
router.get('/popups/active', getActivePublicPopup);

// Contact Submission
router.post('/contact', submitContact);

// Careers & Job Applications (Public)
router.get('/careers', getPublicCareers);
router.get('/careers/:slug', getPublicCareerBySlug);
router.post('/careers/:slug/applications', uploadResume.single('resume'), submitApplication);

// Organization Gallery (Public)
router.get('/gallery', getPublicGallery);
router.get('/gallery/:slug', getPublicAlbumBySlug);
router.get('/gallery-images', getPublicGalleryImages);

// Sitemap & Search Engine Directives
router.get('/sitemap.xml', generateSitemapXml);
router.get('/robots.txt', generateRobotsTxt);

export default router;
