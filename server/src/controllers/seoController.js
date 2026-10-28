import { Page } from '../models/Page.js';
import { BlogPost } from '../models/BlogPost.js';
import { Service } from '../models/Service.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { Redirect } from '../models/Redirect.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { recordAudit } from '../services/auditService.js';

export async function getSeoHealth(req, res, next) {
  try {
    const issues = [];

    const [pages, blogs, services, mediaWithoutAlt] = await Promise.all([
      Page.find({ isDeleted: false }),
      BlogPost.find({ isDeleted: false }),
      Service.find({ isDeleted: false }),
      MediaAsset.find({ $or: [{ altText: '' }, { altText: null }] }).limit(10),
    ]);

    // Check Pages
    pages.forEach((p) => {
      if (!p.seo?.title && !p.title) {
        issues.push({
          type: 'error',
          module: 'Pages',
          title: p.title || 'Untitled Page',
          id: p._id,
          message: 'Missing SEO Title',
        });
      }
      if (!p.seo?.metaDescription) {
        issues.push({
          type: 'warning',
          module: 'Pages',
          title: p.title,
          id: p._id,
          message: 'Missing Meta Description',
        });
      }
      if (!p.featuredImage && !p.seo?.ogImage) {
        issues.push({
          type: 'info',
          module: 'Pages',
          title: p.title,
          id: p._id,
          message: 'No Social Sharing (OG) Image configured',
        });
      }
    });

    // Check Blogs
    blogs.forEach((b) => {
      if (!b.seo?.metaDescription && !b.excerpt) {
        issues.push({
          type: 'warning',
          module: 'Blog',
          title: b.title,
          id: b._id,
          message: 'Missing Meta Description and Excerpt',
        });
      }
      if (!b.featuredImage) {
        issues.push({
          type: 'info',
          module: 'Blog',
          title: b.title,
          id: b._id,
          message: 'No featured thumbnail assigned',
        });
      }
    });

    // Check Media without alt text
    mediaWithoutAlt.forEach((m) => {
      issues.push({
        type: 'warning',
        module: 'Media',
        title: m.originalName,
        id: m._id,
        message: 'Media asset is missing accessible Alt Text',
      });
    });

    // Compute Health Score: 100 minus weighted penalties
    const totalItems = pages.length + blogs.length + services.length;
    const penalty = issues.reduce((acc, curr) => {
      if (curr.type === 'error') return acc + 10;
      if (curr.type === 'warning') return acc + 4;
      return acc + 1;
    }, 0);

    const score = Math.max(25, Math.min(100, Math.round(100 - (penalty / (totalItems || 1)) * 5)));

    res.status(200).json({
      success: true,
      data: {
        score,
        totalItems,
        totalIssues: issues.length,
        issues,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Redirects CRUD
export async function listRedirects(req, res, next) {
  try {
    const list = await Redirect.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
}

export async function createRedirect(req, res, next) {
  try {
    const { sourcePath, destinationPath, statusCode, isActive } = req.body;

    if (!sourcePath || !destinationPath) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Source and destination paths are required.' },
      });
    }

    if (sourcePath.trim() === destinationPath.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'CIRCULAR_REDIRECT', message: 'Source path cannot be identical to destination.' },
      });
    }

    const redirect = await Redirect.create({
      sourcePath: sourcePath.trim(),
      destinationPath: destinationPath.trim(),
      statusCode: statusCode === 302 ? 302 : 301,
      isActive: isActive !== undefined ? isActive : true,
    });

    await recordAudit(req, {
      action: 'seo.redirect_create',
      resourceType: 'Redirect',
      resourceId: redirect._id,
      details: { source: redirect.sourcePath, destination: redirect.destinationPath },
    });

    res.status(201).json({ success: true, data: redirect });
  } catch (error) {
    next(error);
  }
}

export async function updateRedirect(req, res, next) {
  try {
    const redirect = await Redirect.findById(req.params.id);
    if (!redirect) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Redirect rule not found.' },
      });
    }

    const { sourcePath, destinationPath, statusCode, isActive } = req.body;
    if (sourcePath) redirect.sourcePath = sourcePath.trim();
    if (destinationPath) redirect.destinationPath = destinationPath.trim();
    if (statusCode) redirect.statusCode = statusCode;
    if (isActive !== undefined) redirect.isActive = isActive;

    await redirect.save();

    await recordAudit(req, {
      action: 'seo.redirect_update',
      resourceType: 'Redirect',
      resourceId: redirect._id,
      details: { source: redirect.sourcePath, destination: redirect.destinationPath },
    });

    res.status(200).json({ success: true, data: redirect });
  } catch (error) {
    next(error);
  }
}

export async function deleteRedirect(req, res, next) {
  try {
    const redirect = await Redirect.findByIdAndDelete(req.params.id);
    if (!redirect) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Redirect rule not found.' },
      });
    }

    await recordAudit(req, {
      action: 'seo.redirect_delete',
      resourceType: 'Redirect',
      resourceId: req.params.id,
      details: { source: redirect.sourcePath },
    });

    res.status(200).json({ success: true, data: { message: 'Redirect rule deleted.' } });
  } catch (error) {
    next(error);
  }
}

// Dynamic Sitemap Generator
export async function generateSitemapXml(req, res, next) {
  try {
    const settings = (await SiteSettings.findOne({ key: 'global' })) || {};
    const baseUrl = settings.seoDefaults?.canonicalBase || 'https://example.com';

    const [pages, blogs, services] = await Promise.all([
      Page.find({ status: 'published', isDeleted: false }).select('slug updatedAt'),
      BlogPost.find({ status: 'published', isDeleted: false }).select('slug updatedAt'),
      Service.find({ status: 'published', isDeleted: false }).select('slug updatedAt'),
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    pages.forEach((p) => {
      xml += `  <url>\n    <loc>${baseUrl}/${p.slug}</loc>\n    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    blogs.forEach((b) => {
      xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    services.forEach((s) => {
      xml += `  <url>\n    <loc>${baseUrl}/services/${s.slug}</loc>\n    <lastmod>${s.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
}
