import { Page } from '../models/Page.js';
import { BlogPost } from '../models/BlogPost.js';
import { Service } from '../models/Service.js';
import { Redirect } from '../models/Redirect.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { SeoAuditLog } from '../models/SeoAuditLog.js';
import { runFullSeoAudit } from '../services/seoAuditService.js';
import { invalidateRedirectCache } from '../middleware/redirectMiddleware.js';
import { recordAudit } from '../services/auditService.js';
import mongoose from 'mongoose';

// In-memory sitemap cache
let sitemapCache = null;
let sitemapCacheTime = 0;
const SITEMAP_TTL_MS = 60 * 1000; // 1 minute cache

export function invalidateSitemapCache() {
  sitemapCache = null;
  sitemapCacheTime = 0;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Normalize source path: ensure leading slash, trim, lower case, strip trailing slashes
 */
function normalizePath(p) {
  if (!p) return '';
  let clean = p.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    if (!clean.startsWith('/')) clean = '/' + clean;
    if (clean.length > 1 && clean.endsWith('/')) clean = clean.replace(/\/+$/, '');
  }
  return clean;
}

/**
 * Detect redirect loops (up to 10 hops)
 */
async function detectRedirectLoop(source, destination, excludeId = null) {
  const normSource = normalizePath(source).toLowerCase();
  const normDest = normalizePath(destination).toLowerCase();

  if (normSource === normDest) {
    return { hasLoop: true, message: 'Source and destination cannot be identical.' };
  }

  const visited = new Set([normSource]);
  let current = normDest;

  for (let hop = 0; hop < 10; hop++) {
    if (visited.has(current)) {
      return {
        hasLoop: true,
        message: `Redirect loop detected: Path '${source}' eventually routes back to itself via '${current}'.`,
      };
    }
    visited.add(current);

    if (!current.startsWith('/')) break; // External destination ends chain

    const nextHop = await Redirect.findOne({
      sourcePath: current,
      _id: { $ne: excludeId },
      isActive: true,
    }).lean();

    if (!nextHop) break;
    current = normalizePath(nextHop.destinationPath).toLowerCase();
  }

  return { hasLoop: false };
}

/**
 * Detect redirect chains (A -> B where B -> C)
 */
async function detectRedirectChain(destination, excludeId = null) {
  const normDest = normalizePath(destination);
  if (!normDest.startsWith('/')) return { isChained: false };

  const nextHop = await Redirect.findOne({
    sourcePath: normDest,
    _id: { $ne: excludeId },
    isActive: true,
  }).lean();

  if (nextHop) {
    return {
      isChained: true,
      directDestination: nextHop.destinationPath,
      message: `Chain detected: Destination '${destination}' redirects to '${nextHop.destinationPath}'. Consider pointing directly to '${nextHop.destinationPath}'.`,
    };
  }
  return { isChained: false };
}

// ---------------- MODULE 1 & 2: SEO DASHBOARD & AUDIT ----------------

export async function getSeoHealth(req, res, next) {
  try {
    const auditResult = await runFullSeoAudit(req.user?._id);
    res.status(200).json({
      success: true,
      data: auditResult,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSeoAuditHistory(req, res, next) {
  try {
    const history = await SeoAuditLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('triggeredBy', 'displayName email');

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

// ---------------- MODULE 3: REDIRECTS ENGINE & CRUD ----------------

export async function listRedirects(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status === 'active') filter.isActive = true;
    if (req.query.status === 'inactive') filter.isActive = false;

    if (req.query.statusCode && ['301', '302'].includes(req.query.statusCode)) {
      filter.statusCode = parseInt(req.query.statusCode, 10);
    }

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      filter.$or = [
        { sourcePath: searchRegex },
        { destinationPath: searchRegex },
        { description: searchRegex },
      ];
    }

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const [total, list] = await Promise.all([
      Redirect.countDocuments(filter),
      Redirect.find(filter)
        .populate('createdBy', 'displayName email')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: list,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createRedirect(req, res, next) {
  try {
    const { sourcePath, destinationPath, statusCode, isActive, description } = req.body;

    if (!sourcePath || !destinationPath) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Source and destination paths are required.' },
      });
    }

    const normSource = normalizePath(sourcePath);
    const normDest = normalizePath(destinationPath);

    // Validate URLs
    if (!normSource.startsWith('/')) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SOURCE', message: 'Source path must be an internal relative path starting with /.' },
      });
    }

    // Check duplicate source
    const existing = await Redirect.findOne({ sourcePath: normSource });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SOURCE', message: `A redirect rule for source '${normSource}' already exists.` },
      });
    }

    // Check loop
    const loopCheck = await detectRedirectLoop(normSource, normDest);
    if (loopCheck.hasLoop) {
      return res.status(400).json({
        success: false,
        error: { code: 'CIRCULAR_REDIRECT', message: loopCheck.message },
      });
    }

    // Check chain warning
    const chainCheck = await detectRedirectChain(normDest);

    const redirect = await Redirect.create({
      sourcePath: normSource,
      destinationPath: normDest,
      statusCode: statusCode === 302 ? 302 : 301,
      isActive: isActive !== undefined ? isActive : true,
      description: description ? description.trim() : '',
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    invalidateRedirectCache();
    invalidateSitemapCache();

    await recordAudit(req, {
      action: 'seo.redirect_create',
      resourceType: 'Redirect',
      resourceId: redirect._id,
      details: {
        source: redirect.sourcePath,
        destination: redirect.destinationPath,
        statusCode: redirect.statusCode,
      },
    });

    res.status(201).json({
      success: true,
      data: redirect,
      warning: chainCheck.isChained ? chainCheck.message : undefined,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SOURCE', message: 'Source path already exists.' },
      });
    }
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

    const { sourcePath, destinationPath, statusCode, isActive, description } = req.body;

    const normSource = sourcePath ? normalizePath(sourcePath) : redirect.sourcePath;
    const normDest = destinationPath ? normalizePath(destinationPath) : redirect.destinationPath;

    if (sourcePath && !normSource.startsWith('/')) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SOURCE', message: 'Source path must start with /.' },
      });
    }

    // Check conflict if source changed
    if (sourcePath && normSource !== redirect.sourcePath) {
      const conflict = await Redirect.findOne({ sourcePath: normSource, _id: { $ne: redirect._id } });
      if (conflict) {
        return res.status(409).json({
          success: false,
          error: { code: 'DUPLICATE_SOURCE', message: `Source path '${normSource}' is already in use.` },
        });
      }
    }

    // Check loop
    const loopCheck = await detectRedirectLoop(normSource, normDest, redirect._id);
    if (loopCheck.hasLoop) {
      return res.status(400).json({
        success: false,
        error: { code: 'CIRCULAR_REDIRECT', message: loopCheck.message },
      });
    }

    const chainCheck = await detectRedirectChain(normDest, redirect._id);

    redirect.sourcePath = normSource;
    redirect.destinationPath = normDest;
    if (statusCode) redirect.statusCode = statusCode === 302 ? 302 : 301;
    if (isActive !== undefined) redirect.isActive = isActive;
    if (description !== undefined) redirect.description = description.trim();
    redirect.updatedBy = req.user?._id;

    await redirect.save();

    invalidateRedirectCache();
    invalidateSitemapCache();

    await recordAudit(req, {
      action: 'seo.redirect_update',
      resourceType: 'Redirect',
      resourceId: redirect._id,
      details: { source: redirect.sourcePath, destination: redirect.destinationPath },
    });

    res.status(200).json({
      success: true,
      data: redirect,
      warning: chainCheck.isChained ? chainCheck.message : undefined,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SOURCE', message: 'Source path already exists.' },
      });
    }
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

    invalidateRedirectCache();
    invalidateSitemapCache();

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

export async function exportRedirectsCsv(req, res, next) {
  try {
    const redirects = await Redirect.find().sort({ createdAt: -1 });

    const headers = ['sourcePath', 'destinationPath', 'statusCode', 'isActive', 'hitCount', 'description'];
    const rows = redirects.map((r) => [
      `"${r.sourcePath.replace(/"/g, '""')}"`,
      `"${r.destinationPath.replace(/"/g, '""')}"`,
      r.statusCode || 301,
      r.isActive ? 'true' : 'false',
      r.hitCount || 0,
      `"${(r.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="redirects_export.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
}

export async function importRedirectsCsv(req, res, next) {
  try {
    const { csvData } = req.body;
    if (!csvData || typeof csvData !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid CSV data text is required.' },
      });
    }

    const lines = csvData.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_CSV', message: 'CSV must contain a header line and at least one record.' },
      });
    }

    let importedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Basic CSV token parser
      const tokens = line.split(',').map((t) => t.trim().replace(/^"|"$/g, ''));
      const source = tokens[0];
      const dest = tokens[1];
      const code = parseInt(tokens[2], 10) === 302 ? 302 : 301;
      const active = tokens[3] !== 'false';
      const desc = tokens[5] || '';

      if (!source || !dest) {
        errors.push(`Row ${i + 1}: Missing source or destination path.`);
        skippedCount++;
        continue;
      }

      const normSource = normalizePath(source);
      const normDest = normalizePath(dest);

      if (normSource === normDest) {
        errors.push(`Row ${i + 1}: Source and destination are identical ('${normSource}').`);
        skippedCount++;
        continue;
      }

      try {
        const loop = await detectRedirectLoop(normSource, normDest);
        if (loop.hasLoop) {
          errors.push(`Row ${i + 1}: ${loop.message}`);
          skippedCount++;
          continue;
        }

        await Redirect.findOneAndUpdate(
          { sourcePath: normSource },
          {
            sourcePath: normSource,
            destinationPath: normDest,
            statusCode: code,
            isActive: active,
            description: desc,
            updatedBy: req.user?._id,
          },
          { upsert: true, new: true }
        );
        importedCount++;
      } catch (err) {
        errors.push(`Row ${i + 1} ('${normSource}'): ${err.message}`);
        skippedCount++;
      }
    }

    invalidateRedirectCache();
    invalidateSitemapCache();

    await recordAudit(req, {
      action: 'seo.redirect_import_csv',
      resourceType: 'Redirect',
      details: { importedCount, skippedCount, errorCount: errors.length },
    });

    res.status(200).json({
      success: true,
      data: {
        importedCount,
        skippedCount,
        errors,
        message: `Import complete: ${importedCount} redirects processed, ${skippedCount} skipped.`,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ---------------- MODULE 4: DYNAMIC XML SITEMAP ----------------

export async function generateSitemapXml(req, res, next) {
  try {
    const now = Date.now();
    if (sitemapCache && now - sitemapCacheTime < SITEMAP_TTL_MS) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(sitemapCache);
    }

    const settings = (await SiteSettings.findOne({ key: 'global' })) || {};
    const baseUrl = settings.seoDefaults?.canonicalBase || 'https://example.com';
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    // Get active redirect source paths to exclude them from sitemap
    const activeRedirects = await Redirect.find({ isActive: true }).select('sourcePath').lean();
    const redirectSources = new Set(activeRedirects.map((r) => r.sourcePath));

    const [pages, blogs, services] = await Promise.all([
      Page.find({ status: 'published', isDeleted: false }).select('slug updatedAt seo'),
      BlogPost.find({ status: 'published', isDeleted: false }).select('slug updatedAt seo'),
      Service.find({ status: 'published', isDeleted: false }).select('slug updatedAt seo'),
    ]);

    const urlEntries = new Map(); // loc -> { loc, lastmod, changefreq, priority }

    // Homepage
    urlEntries.set(`${cleanBaseUrl}/`, {
      loc: `${cleanBaseUrl}/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0',
    });

    // Pages (exclude noindex & redirects)
    pages.forEach((p) => {
      const path = `/${p.slug}`;
      if (p.seo?.robots?.includes('noindex')) return;
      if (redirectSources.has(path)) return;

      const loc = p.seo?.canonicalUrl && p.seo.canonicalUrl.startsWith('http')
        ? p.seo.canonicalUrl
        : `${cleanBaseUrl}${path}`;

      urlEntries.set(loc, {
        loc,
        lastmod: (p.updatedAt || new Date()).toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8',
      });
    });

    // Services (exclude noindex & redirects)
    services.forEach((s) => {
      const path = `/services/${s.slug}`;
      if (s.seo?.robots?.includes('noindex')) return;
      if (redirectSources.has(path)) return;

      const loc = s.seo?.canonicalUrl && s.seo.canonicalUrl.startsWith('http')
        ? s.seo.canonicalUrl
        : `${cleanBaseUrl}${path}`;

      urlEntries.set(loc, {
        loc,
        lastmod: (s.updatedAt || new Date()).toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8',
      });
    });

    // Blogs (exclude noindex & redirects)
    blogs.forEach((b) => {
      const path = `/blog/${b.slug}`;
      if (b.seo?.robots?.includes('noindex')) return;
      if (redirectSources.has(path)) return;

      const loc = b.seo?.canonicalUrl && b.seo.canonicalUrl.startsWith('http')
        ? b.seo.canonicalUrl
        : `${cleanBaseUrl}${path}`;

      urlEntries.set(loc, {
        loc,
        lastmod: (b.updatedAt || new Date()).toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.7',
      });
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const entry of urlEntries.values()) {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    sitemapCache = xml;
    sitemapCacheTime = now;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
}

// ---------------- MODULE 5: ROBOTS.TXT ----------------

export async function generateRobotsTxt(req, res, next) {
  try {
    const settings = (await SiteSettings.findOne({ key: 'global' })) || {};
    const baseUrl = settings.seoDefaults?.siteUrl || settings.seoDefaults?.canonicalBase || 'https://example.com';
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const globalRobots = settings.seoDefaults?.robots || 'index, follow';
    const customRules = settings.seoDefaults?.customRobotsTxt || '';

    let content = `# Robots.txt generated automatically by Master Admin CMS\n`;

    if (globalRobots.includes('noindex')) {
      // Global Staging / Private mode
      content += `User-agent: *\n`;
      content += `Disallow: /\n\n`;
    } else {
      content += `User-agent: *\n`;
      content += `Allow: /\n`;
      content += `Disallow: /api/\n`;
      content += `Disallow: /private_uploads/\n`;
      content += `Disallow: /uploads/resumes/\n`;
      content += `Disallow: /admin\n\n`;

      if (customRules.trim()) {
        content += `# Custom Crawl Directives\n${customRules.trim()}\n\n`;
      }

      content += `Sitemap: ${cleanBaseUrl}/sitemap.xml\n`;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(content);
  } catch (error) {
    next(error);
  }
}

// ---------------- MODULE 6: GLOBAL SEO SETTINGS ----------------

export async function getGlobalSeoSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne({ key: 'global' });
    if (!settings) {
      settings = await SiteSettings.create({ key: 'global' });
    }

    const seo = settings.seoDefaults || {};
    res.status(200).json({
      success: true,
      data: {
        siteName: settings.siteName,
        siteTagline: settings.siteTagline,
        siteTitle: seo.metaTitle || settings.siteName || '',
        metaTitle: seo.metaTitle || settings.siteName || '',
        defaultMetaDescription: seo.metaDescription || '',
        metaDescription: seo.metaDescription || '',
        defaultOgImage: seo.defaultOgImage || '',
        defaultTwitterImage: seo.defaultTwitterImage || '',
        defaultCanonicalBase: seo.canonicalBase || seo.siteUrl || '',
        canonicalBase: seo.canonicalBase || seo.siteUrl || '',
        siteUrl: seo.siteUrl || seo.canonicalBase || '',
        robotsDirective: seo.robots || 'index, follow',
        robots: seo.robots || 'index, follow',
        customRobotsTxt: seo.customRobotsTxt || '',
        ...(seo.toObject ? seo.toObject() : seo),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateGlobalSeoSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne({ key: 'global' });
    if (!settings) {
      settings = new SiteSettings({ key: 'global' });
    }

    const {
      siteTitle,
      metaTitle,
      defaultMetaDescription,
      metaDescription,
      defaultOgImage,
      defaultTwitterImage,
      robotsDirective,
      robots,
      defaultCanonicalBase,
      canonicalBase,
      siteUrl,
      customRobotsTxt,
    } = req.body;

    const chosenTitle = siteTitle !== undefined ? siteTitle : metaTitle;
    const chosenDesc = defaultMetaDescription !== undefined ? defaultMetaDescription : metaDescription;
    const chosenRobots = robotsDirective !== undefined ? robotsDirective : robots;
    const chosenCanonical = defaultCanonicalBase !== undefined ? defaultCanonicalBase : canonicalBase;

    settings.seoDefaults = {
      ...settings.seoDefaults,
      metaTitle: chosenTitle !== undefined ? chosenTitle.trim() : settings.seoDefaults?.metaTitle,
      metaDescription: chosenDesc !== undefined ? chosenDesc.trim() : settings.seoDefaults?.metaDescription,
      defaultOgImage: defaultOgImage !== undefined ? defaultOgImage.trim() : settings.seoDefaults?.defaultOgImage,
      defaultTwitterImage: defaultTwitterImage !== undefined ? defaultTwitterImage.trim() : settings.seoDefaults?.defaultTwitterImage,
      robots: chosenRobots || settings.seoDefaults?.robots || 'index, follow',
      canonicalBase: chosenCanonical !== undefined ? chosenCanonical.trim() : settings.seoDefaults?.canonicalBase,
      siteUrl: siteUrl !== undefined ? siteUrl.trim() : settings.seoDefaults?.siteUrl,
      customRobotsTxt: customRobotsTxt !== undefined ? customRobotsTxt.trim() : settings.seoDefaults?.customRobotsTxt,
    };

    settings.updatedBy = req.user?._id;
    await settings.save();

    invalidateSitemapCache();

    await recordAudit(req, {
      action: 'seo.settings_update',
      resourceType: 'SiteSettings',
      resourceId: settings._id,
      details: { canonicalBase: settings.seoDefaults.canonicalBase, robots: settings.seoDefaults.robots },
    });

    res.status(200).json({
      success: true,
      data: {
        siteTitle: settings.seoDefaults.metaTitle,
        metaTitle: settings.seoDefaults.metaTitle,
        defaultMetaDescription: settings.seoDefaults.metaDescription,
        metaDescription: settings.seoDefaults.metaDescription,
        defaultOgImage: settings.seoDefaults.defaultOgImage,
        defaultTwitterImage: settings.seoDefaults.defaultTwitterImage,
        defaultCanonicalBase: settings.seoDefaults.canonicalBase,
        canonicalBase: settings.seoDefaults.canonicalBase,
        siteUrl: settings.seoDefaults.siteUrl,
        robotsDirective: settings.seoDefaults.robots,
        robots: settings.seoDefaults.robots,
        customRobotsTxt: settings.seoDefaults.customRobotsTxt,
      },
    });
  } catch (error) {
    next(error);
  }
}
