import { Redirect } from '../models/Redirect.js';

let cachedRedirects = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 15000; // 15-second memory cache for high throughput

/**
 * Invalidate in-memory redirect cache
 */
export function invalidateRedirectCache() {
  cachedRedirects = null;
  lastCacheTime = 0;
}

/**
 * Load or retrieve cached active redirect mappings
 */
async function getActiveRedirects() {
  const now = Date.now();
  if (cachedRedirects && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedRedirects;
  }

  const list = await Redirect.find({ isActive: true })
    .select('sourcePath destinationPath statusCode _id')
    .lean();

  const map = new Map();
  for (const r of list) {
    if (r.sourcePath) {
      map.set(r.sourcePath.trim(), r);
      // Also map normalized path without trailing slash
      const normalized = r.sourcePath.trim().replace(/\/+$/, '') || '/';
      map.set(normalized, r);
    }
  }

  cachedRedirects = map;
  lastCacheTime = now;
  return map;
}

/**
 * Express middleware to execute active 301/302 redirects across public application requests
 */
export function publicRedirectMiddleware() {
  return async (req, res, next) => {
    // Only intercept safe read requests (GET / HEAD)
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    const path = req.path;

    // Skip internal administrative, API, uploads, and health routes
    if (
      path.startsWith('/api') ||
      path.startsWith('/uploads') ||
      path.startsWith('/private_uploads') ||
      path.startsWith('/assets') ||
      path.startsWith('/@') ||
      path === '/robots.txt' ||
      path === '/favicon.ico'
    ) {
      return next();
    }

    try {
      const redirectsMap = await getActiveRedirects();
      const normalizedPath = path.replace(/\/+$/, '') || '/';

      const match = redirectsMap.get(path) || redirectsMap.get(normalizedPath);

      if (match) {
        // Asynchronously update hit analytics
        Redirect.updateOne(
          { _id: match._id },
          { $inc: { hitCount: 1 }, $set: { lastTriggeredAt: new Date() } }
        ).exec().catch(() => {});

        // Support preserving query string if present
        let dest = match.destinationPath;
        const queryIdx = req.originalUrl.indexOf('?');
        if (queryIdx !== -1 && !dest.includes('?')) {
          dest += req.originalUrl.slice(queryIdx);
        }

        return res.redirect(match.statusCode || 301, dest);
      }
    } catch (err) {
      console.warn('[Redirect Middleware Warning]', err.message);
    }

    next();
  };
}
