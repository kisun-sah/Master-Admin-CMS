import { Page } from '../models/Page.js';
import { BlogPost } from '../models/BlogPost.js';
import { Service } from '../models/Service.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { Redirect } from '../models/Redirect.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { SeoAuditLog } from '../models/SeoAuditLog.js';

/**
 * Extract internal URLs from text or HTML content
 */
function extractInternalLinks(content) {
  if (!content || typeof content !== 'string') return [];
  const links = [];
  const hrefRegex = /href=["'](\/[^"'#?]+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    if (match[1] && !match[1].startsWith('/api') && !match[1].startsWith('/uploads')) {
      links.push(match[1]);
    }
  }
  return links;
}

/**
 * Check if content or block items contain an H1 heading
 */
function hasH1Heading(item, type) {
  if (type === 'pages' && Array.isArray(item.blocks)) {
    for (const block of item.blocks) {
      if (block.type === 'hero' && block.title) return true;
      if (block.content && /<h1[^>]*>.*?<\/h1>/i.test(block.content)) return true;
    }
  }
  if (item.content && /<h1[^>]*>.*?<\/h1>/i.test(item.content)) return true;
  if (item.body && /<h1[^>]*>.*?<\/h1>/i.test(item.body)) return true;
  // If item has title, title serves as default template H1
  return !!item.title;
}

/**
 * Perform comprehensive SEO audit across all published content
 */
export async function runFullSeoAudit(userId = null) {
  const settings = (await SiteSettings.findOne({ key: 'global' })) || {};
  const baseUrl = settings.seoDefaults?.canonicalBase || 'https://example.com';

  const [pages, blogs, services, mediaList, redirects] = await Promise.all([
    Page.find({ status: 'published', isDeleted: false }),
    BlogPost.find({ status: 'published', isDeleted: false }),
    Service.find({ status: 'published', isDeleted: false }),
    MediaAsset.find().limit(50),
    Redirect.find({ isActive: true }),
  ]);

  const activeRedirectSources = new Set(redirects.map((r) => r.sourcePath));

  // Build route lookup sets for broken link detection
  const validRoutes = new Set(['/', '/contact', '/about', '/services', '/blog', '/careers', '/gallery']);
  pages.forEach((p) => validRoutes.add(`/${p.slug}`));
  services.forEach((s) => validRoutes.add(`/services/${s.slug}`));
  blogs.forEach((b) => validRoutes.add(`/blog/${b.slug}`));

  const issues = [];
  const titleMap = new Map(); // title -> [items]
  const descMap = new Map(); // desc -> [items]

  let metadataDeficits = 0;
  let accessibilityDeficits = 0;
  let technicalDeficits = 0;

  // 1. Audit Pages
  pages.forEach((p) => {
    const title = p.seo?.title || p.title || '';
    const desc = p.seo?.metaDescription || p.excerpt || '';
    const canonical = p.seo?.canonicalUrl || '';
    const robots = p.seo?.robots || 'index, follow';
    const ogImage = p.seo?.ogImage || p.featuredImage || '';

    // Title checks
    if (!title) {
      issues.push({
        id: p._id,
        itemType: 'page',
        module: 'Pages',
        moduleRoute: 'pages',
        title: p.title || 'Untitled Page',
        slug: p.slug,
        category: 'metadata',
        severity: 'error',
        field: 'seo.title',
        message: 'Missing SEO Title tag',
        recommendation: 'Add a concise, keyword-rich SEO title between 20 and 60 characters.',
      });
      metadataDeficits += 15;
    } else {
      if (title.length < 20) {
        issues.push({
          id: p._id,
          itemType: 'page',
          module: 'Pages',
          moduleRoute: 'pages',
          title: p.title,
          slug: p.slug,
          category: 'metadata',
          severity: 'warning',
          field: 'seo.title',
          message: `SEO Title is too short (${title.length} chars)`,
          recommendation: 'Expand title to at least 20 characters for higher search CTR.',
        });
        metadataDeficits += 5;
      } else if (title.length > 60) {
        issues.push({
          id: p._id,
          itemType: 'page',
          module: 'Pages',
          moduleRoute: 'pages',
          title: p.title,
          slug: p.slug,
          category: 'metadata',
          severity: 'warning',
          field: 'seo.title',
          message: `SEO Title exceeds recommended limit (${title.length} chars)`,
          recommendation: 'Shorten title to under 60 characters to avoid truncation in Google search results.',
        });
        metadataDeficits += 4;
      }

      // Track duplicate titles
      const normTitle = title.trim().toLowerCase();
      if (!titleMap.has(normTitle)) titleMap.set(normTitle, []);
      titleMap.get(normTitle).push({ id: p._id, module: 'Pages', title: p.title });
    }

    // Description checks
    if (!desc) {
      issues.push({
        id: p._id,
        itemType: 'page',
        module: 'Pages',
        moduleRoute: 'pages',
        title: p.title,
        slug: p.slug,
        category: 'metadata',
        severity: 'warning',
        field: 'seo.metaDescription',
        message: 'Missing Meta Description',
        recommendation: 'Add a captivating meta description between 50 and 160 characters.',
      });
      metadataDeficits += 10;
    } else {
      if (desc.length < 50) {
        issues.push({
          id: p._id,
          itemType: 'page',
          module: 'Pages',
          moduleRoute: 'pages',
          title: p.title,
          slug: p.slug,
          category: 'metadata',
          severity: 'warning',
          field: 'seo.metaDescription',
          message: `Meta Description is too short (${desc.length} chars)`,
          recommendation: 'Expand description to at least 50 characters for search snippet previews.',
        });
        metadataDeficits += 4;
      } else if (desc.length > 160) {
        issues.push({
          id: p._id,
          itemType: 'page',
          module: 'Pages',
          moduleRoute: 'pages',
          title: p.title,
          slug: p.slug,
          category: 'metadata',
          severity: 'warning',
          field: 'seo.metaDescription',
          message: `Meta Description exceeds 160 characters (${desc.length} chars)`,
          recommendation: 'Keep description between 50-160 characters to prevent snippet ellipsis.',
        });
        metadataDeficits += 3;
      }

      const normDesc = desc.trim().toLowerCase();
      if (!descMap.has(normDesc)) descMap.set(normDesc, []);
      descMap.get(normDesc).push({ id: p._id, module: 'Pages', title: p.title });
    }

    // Heading Accessibility
    if (!hasH1Heading(p, 'pages')) {
      issues.push({
        id: p._id,
        itemType: 'page',
        module: 'Pages',
        moduleRoute: 'pages',
        title: p.title,
        slug: p.slug,
        category: 'accessibility',
        severity: 'warning',
        field: 'blocks',
        message: 'Page is missing a primary H1 heading element',
        recommendation: 'Ensure your page layout includes a primary H1 heading or Hero title block.',
      });
      accessibilityDeficits += 8;
    }

    // Open Graph Social Media
    if (!ogImage) {
      issues.push({
        id: p._id,
        itemType: 'page',
        module: 'Pages',
        moduleRoute: 'pages',
        title: p.title,
        slug: p.slug,
        category: 'metadata',
        severity: 'info',
        field: 'seo.ogImage',
        message: 'No Social Sharing (OG/Twitter) Image configured',
        recommendation: 'Add a 1200x630px social image to boost engagement when shared on Twitter/LinkedIn/Facebook.',
      });
      metadataDeficits += 3;
    }

    // Technical Indexability & Robots
    if (robots.includes('noindex')) {
      issues.push({
        id: p._id,
        itemType: 'page',
        module: 'Pages',
        moduleRoute: 'pages',
        title: p.title,
        slug: p.slug,
        category: 'technical',
        severity: 'warning',
        field: 'seo.robots',
        message: `Directives instruct search engines to ignore this page ('${robots}')`,
        recommendation: 'Change robots directive to "index, follow" if you want this page discoverable on search engines.',
      });
      technicalDeficits += 10;
    }

    // Redirect Collision
    if (activeRedirectSources.has(`/${p.slug}`)) {
      issues.push({
        id: p._id,
        itemType: 'page',
        module: 'Pages',
        moduleRoute: 'pages',
        title: p.title,
        slug: p.slug,
        category: 'technical',
        severity: 'error',
        field: 'slug',
        message: `Conflict: Page URL '/${p.slug}' is hijacked by an active 301/302 redirect`,
        recommendation: 'Disable or change the redirect rule pointing away from this active published page.',
      });
      technicalDeficits += 15;
    }

    // Broken Internal Links
    const internalLinks = extractInternalLinks(p.excerpt + JSON.stringify(p.blocks || []));
    internalLinks.forEach((link) => {
      if (!validRoutes.has(link) && !activeRedirectSources.has(link)) {
        issues.push({
          id: p._id,
          itemType: 'page',
          module: 'Pages',
          moduleRoute: 'pages',
          title: p.title,
          slug: p.slug,
          category: 'technical',
          severity: 'error',
          field: 'blocks',
          message: `Broken internal link detected: '${link}'`,
          recommendation: `Update the broken link or configure a 301 redirect to valid content.`,
        });
        technicalDeficits += 10;
      }
    });
  });

  // 2. Audit Services
  services.forEach((s) => {
    const title = s.seo?.title || s.title || '';
    const desc = s.seo?.metaDescription || s.shortDescription || '';
    const robots = s.seo?.robots || 'index, follow';
    const image = s.featuredImage || s.icon || s.seo?.ogImage || '';

    if (!title) {
      issues.push({
        id: s._id,
        itemType: 'service',
        module: 'Services',
        moduleRoute: 'services',
        title: s.title || 'Untitled Service',
        slug: s.slug,
        category: 'metadata',
        severity: 'error',
        field: 'title',
        message: 'Missing Service Title and SEO title',
        recommendation: 'Provide a descriptive title for this service offering.',
      });
      metadataDeficits += 15;
    } else {
      if (title.length < 20) {
        issues.push({
          id: s._id,
          itemType: 'service',
          module: 'Services',
          moduleRoute: 'services',
          title: s.title,
          slug: s.slug,
          category: 'metadata',
          severity: 'warning',
          field: 'seo.title',
          message: `Service Title is brief (${title.length} chars)`,
          recommendation: 'Optimize service title with target keywords (e.g., "Enterprise Cloud Infrastructure Solutions").',
        });
        metadataDeficits += 4;
      }
      const normTitle = title.trim().toLowerCase();
      if (!titleMap.has(normTitle)) titleMap.set(normTitle, []);
      titleMap.get(normTitle).push({ id: s._id, module: 'Services', title: s.title });
    }

    if (!desc) {
      issues.push({
        id: s._id,
        itemType: 'service',
        module: 'Services',
        moduleRoute: 'services',
        title: s.title,
        slug: s.slug,
        category: 'metadata',
        severity: 'warning',
        field: 'seo.metaDescription',
        message: 'Missing Service Description & Meta Summary',
        recommendation: 'Add a 50-160 character meta description highlighting value proposition.',
      });
      metadataDeficits += 10;
    } else {
      const normDesc = desc.trim().toLowerCase();
      if (!descMap.has(normDesc)) descMap.set(normDesc, []);
      descMap.get(normDesc).push({ id: s._id, module: 'Services', title: s.title });
    }

    if (!image) {
      issues.push({
        id: s._id,
        itemType: 'service',
        module: 'Services',
        moduleRoute: 'services',
        title: s.title,
        slug: s.slug,
        category: 'accessibility',
        severity: 'info',
        field: 'featuredImage',
        message: 'No thumbnail or icon image set for service card',
        recommendation: 'Assign a featured banner or icon to maximize visual CTR.',
      });
      accessibilityDeficits += 4;
    }

    if (robots.includes('noindex')) {
      issues.push({
        id: s._id,
        itemType: 'service',
        module: 'Services',
        moduleRoute: 'services',
        title: s.title,
        slug: s.slug,
        category: 'technical',
        severity: 'warning',
        field: 'seo.robots',
        message: 'Service marked as "noindex" — will be omitted from Google Search and XML Sitemap',
        recommendation: 'Set robots to "index, follow" for search indexing.',
      });
      technicalDeficits += 10;
    }
  });

  // 3. Audit Blogs
  blogs.forEach((b) => {
    const title = b.seo?.title || b.title || '';
    const desc = b.seo?.metaDescription || b.excerpt || '';
    const robots = b.seo?.robots || 'index, follow';
    const image = b.featuredImage || b.seo?.ogImage || '';

    if (!title) {
      issues.push({
        id: b._id,
        itemType: 'blog',
        module: 'Blog',
        moduleRoute: 'blogs',
        title: b.title || 'Untitled Article',
        slug: b.slug,
        category: 'metadata',
        severity: 'error',
        field: 'title',
        message: 'Missing Article Title',
        recommendation: 'Add an engaging article headline.',
      });
      metadataDeficits += 15;
    } else {
      const normTitle = title.trim().toLowerCase();
      if (!titleMap.has(normTitle)) titleMap.set(normTitle, []);
      titleMap.get(normTitle).push({ id: b._id, module: 'Blog', title: b.title });
    }

    if (!desc) {
      issues.push({
        id: b._id,
        itemType: 'blog',
        module: 'Blog',
        moduleRoute: 'blogs',
        title: b.title,
        slug: b.slug,
        category: 'metadata',
        severity: 'warning',
        field: 'excerpt',
        message: 'Missing Article Excerpt and Meta Description',
        recommendation: 'Provide a compelling 1-2 sentence excerpt summarizing the article.',
      });
      metadataDeficits += 10;
    } else {
      const normDesc = desc.trim().toLowerCase();
      if (!descMap.has(normDesc)) descMap.set(normDesc, []);
      descMap.get(normDesc).push({ id: b._id, module: 'Blog', title: b.title });
    }

    if (!image) {
      issues.push({
        id: b._id,
        itemType: 'blog',
        module: 'Blog',
        moduleRoute: 'blogs',
        title: b.title,
        slug: b.slug,
        category: 'accessibility',
        severity: 'info',
        field: 'featuredImage',
        message: 'No Featured Cover Image for article',
        recommendation: 'Attach a high-resolution cover image for social sharing cards.',
      });
      accessibilityDeficits += 4;
    }

    if (robots.includes('noindex')) {
      issues.push({
        id: b._id,
        itemType: 'blog',
        module: 'Blog',
        moduleRoute: 'blogs',
        title: b.title,
        slug: b.slug,
        category: 'technical',
        severity: 'warning',
        field: 'seo.robots',
        message: 'Blog post is marked as "noindex"',
        recommendation: 'Allow indexing if this article should attract organic search traffic.',
      });
      technicalDeficits += 10;
    }
  });

  // 4. Duplicate Metadata Detection
  for (const [titleText, occurrences] of titleMap.entries()) {
    if (occurrences.length > 1) {
      occurrences.forEach((occ) => {
        issues.push({
          id: occ.id,
          module: occ.module,
          moduleRoute: occ.module.toLowerCase(),
          title: occ.title,
          category: 'metadata',
          severity: 'error',
          field: 'seo.title',
          message: `Duplicate SEO Title: '${titleText}' is shared across ${occurrences.length} items`,
          recommendation: 'Each indexed page or post must feature a uniquely differentiated title tag.',
        });
        metadataDeficits += 8;
      });
    }
  }

  for (const [descText, occurrences] of descMap.entries()) {
    if (occurrences.length > 1 && descText.length > 15) {
      occurrences.forEach((occ) => {
        issues.push({
          id: occ.id,
          module: occ.module,
          moduleRoute: occ.module.toLowerCase(),
          title: occ.title,
          category: 'metadata',
          severity: 'warning',
          field: 'seo.metaDescription',
          message: `Duplicate Meta Description shared across ${occurrences.length} content items`,
          recommendation: 'Craft unique meta descriptions tailored to each specific article or page topic.',
        });
        metadataDeficits += 5;
      });
    }
  }

  // 5. Media Accessibility (Missing Alt Text)
  mediaList.forEach((m) => {
    if (!m.altText || m.altText.trim() === '') {
      issues.push({
        id: m._id,
        itemType: 'media',
        module: 'Media',
        moduleRoute: 'media',
        title: m.originalName || m.filename,
        category: 'accessibility',
        severity: 'warning',
        field: 'altText',
        message: 'Media asset is missing accessible Alt Text',
        recommendation: 'Add descriptive alt text for screen readers, web accessibility, and Google Image SEO.',
      });
      accessibilityDeficits += 6;
    }
  });

  // Calculate Sub-Scores (0 to 100)
  const totalCoreItems = Math.max(1, pages.length + services.length + blogs.length);
  const totalMediaItems = Math.max(1, mediaList.length);

  const metadataScore = Math.max(10, Math.min(100, Math.round(100 - (metadataDeficits / totalCoreItems) * 4)));
  const accessibilityScore = Math.max(15, Math.min(100, Math.round(100 - (accessibilityDeficits / (totalCoreItems + totalMediaItems)) * 6)));
  const technicalScore = Math.max(20, Math.min(100, Math.round(100 - (technicalDeficits / totalCoreItems) * 5)));

  // Weighted Overall Quality Score
  const overallScore = Math.round(metadataScore * 0.45 + accessibilityScore * 0.25 + technicalScore * 0.3);

  // Categorize issues
  const criticalErrors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const recommendations = issues.filter((i) => i.severity === 'info').length;

  let indexabilityStatus = 'healthy';
  if (criticalErrors > 0 || overallScore < 60) {
    indexabilityStatus = 'critical';
  } else if (warnings > 2 || overallScore < 85) {
    indexabilityStatus = 'needs_attention';
  }

  const breakdown = {
    pages: {
      total: pages.length,
      issues: issues.filter((i) => i.module === 'Pages').length,
    },
    services: {
      total: services.length,
      issues: issues.filter((i) => i.module === 'Services').length,
    },
    blogs: {
      total: blogs.length,
      issues: issues.filter((i) => i.module === 'Blog').length,
    },
    media: {
      total: mediaList.length,
      issues: issues.filter((i) => i.module === 'Media').length,
    },
  };

  // Persist audit snapshot in SeoAuditLog
  const auditLog = await SeoAuditLog.create({
    overallScore,
    metadataScore,
    accessibilityScore,
    technicalScore,
    totalItems: pages.length + services.length + blogs.length + mediaList.length,
    totalIssues: issues.length,
    criticalErrors,
    warnings,
    recommendations,
    breakdown,
    triggeredBy: userId,
  });

  // Retrieve last 10 trend snapshots
  const historicalTrends = await SeoAuditLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('overallScore metadataScore accessibilityScore technicalScore createdAt');

  return {
    score: overallScore,
    overallScore,
    metadataScore,
    accessibilityScore,
    technicalScore,
    status: indexabilityStatus,
    indexabilityStatus,
    lastAuditAt: auditLog.createdAt,
    lastAuditTimestamp: auditLog.createdAt,
    totalItems: pages.length + services.length + blogs.length + mediaList.length,
    totalIssues: issues.length,
    errorsCount: criticalErrors,
    criticalErrors,
    warningsCount: warnings,
    warnings,
    infoCount: recommendations,
    recommendations,
    breakdown,
    issues,
    historicalTrends: historicalTrends.reverse(),
  };
}
