import { Page } from '../models/Page.js';
import { BlogPost } from '../models/BlogPost.js';
import { Service } from '../models/Service.js';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { Slider } from '../models/Slider.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { Testimonial } from '../models/Testimonial.js';
import { AuditEvent } from '../models/AuditEvent.js';

export async function getDashboardStats(req, res, next) {
  try {
    const [
      totalPages,
      publishedPages,
      draftPages,
      totalBlogs,
      publishedBlogs,
      totalServices,
      activeServices,
      totalContacts,
      newContacts,
      activeSliders,
      totalMedia,
      totalTestimonials,
      recentPages,
      recentBlogs,
      recentAuditLogs,
    ] = await Promise.all([
      Page.countDocuments({ isDeleted: false }),
      Page.countDocuments({ status: 'published', isDeleted: false }),
      Page.countDocuments({ status: 'draft', isDeleted: false }),
      BlogPost.countDocuments({ isDeleted: false }),
      BlogPost.countDocuments({ status: 'published', isDeleted: false }),
      Service.countDocuments({ isDeleted: false }),
      Service.countDocuments({ status: 'published', isDeleted: false }),
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ status: 'new' }),
      Slider.countDocuments({ status: 'active' }),
      MediaAsset.countDocuments(),
      Testimonial.countDocuments({ status: 'published' }),
      Page.find({ isDeleted: false }).sort({ updatedAt: -1 }).limit(5).select('title slug status updatedAt'),
      BlogPost.find({ isDeleted: false }).sort({ updatedAt: -1 }).limit(5).select('title slug status updatedAt category'),
      AuditEvent.find().sort({ createdAt: -1 }).limit(8),
    ]);

    // Trend simulation based on last 7 days aggregation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivityCount = await AuditEvent.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          pages: { total: totalPages, published: publishedPages, draft: draftPages },
          blogs: { total: totalBlogs, published: publishedBlogs, draft: totalBlogs - publishedBlogs },
          services: { total: totalServices, active: activeServices },
          contacts: { total: totalContacts, new: newContacts },
          sliders: { active: activeSliders },
          media: { total: totalMedia },
          testimonials: { total: totalTestimonials },
          recentActivityEvents: recentActivityCount,
        },
        recentContent: {
          pages: recentPages,
          blogs: recentBlogs,
        },
        recentAuditLogs,
      },
    });
  } catch (error) {
    next(error);
  }
}
