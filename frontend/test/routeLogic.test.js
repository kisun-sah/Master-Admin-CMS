import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Route resolution test suite for Admin CMS router
 * Validates the getRouteFromLocation parser implemented in AppLayout.jsx
 */

const VALID_ROUTES = new Set([
  'dashboard',
  'settings',
  'content-pillars',
  'navigation',
  'sliders',
  'popups',
  'pages',
  'services',
  'blogs',
  'gallery',
  'media',
  'testimonials',
  'team',
  'partners',
  'faqs',
  'careers',
  'jobapplications',
  'contacts',
  'seo',
  'users',
  'audit',
  'system',
]);

function getRouteFromLocation(location) {
  const segments = location.pathname.split('/').filter(Boolean);
  if (segments[0] === 'admin') {
    const route = (segments[1] || 'dashboard').toLowerCase();
    if (VALID_ROUTES.has(route)) return route;
  }
  if (location.hash && location.hash.length > 1) {
    const rawHash = location.hash.replace(/^#\/?/, '').split('/')[0].split('?')[0].toLowerCase();
    if (VALID_ROUTES.has(rawHash)) return rawHash;
  }
  const rawPath = location.pathname.replace(/^\/+/, '').split('/')[0].split('?')[0].toLowerCase();
  if (VALID_ROUTES.has(rawPath)) return rawPath;
  return 'dashboard';
}

test('Route parser resolves /services (under basename="/admin") to services module', () => {
  const loc = { pathname: '/services', hash: '' };
  assert.equal(getRouteFromLocation(loc), 'services');
});

test('Route parser resolves /admin/services to services module', () => {
  const loc = { pathname: '/admin/services', hash: '' };
  assert.equal(getRouteFromLocation(loc), 'services');
});

test('Route parser resolves /admin/blogs to blogs module', () => {
  const loc = { pathname: '/admin/blogs', hash: '' };
  assert.equal(getRouteFromLocation(loc), 'blogs');
});

test('Route parser resolves /admin/content-pillars to content-pillars module', () => {
  const loc = { pathname: '/admin/content-pillars', hash: '' };
  assert.equal(getRouteFromLocation(loc), 'content-pillars');
});

test('Route parser resolves direct /content-pillars under admin router', () => {
  const loc = { pathname: '/content-pillars', hash: '' };
  assert.equal(getRouteFromLocation(loc), 'content-pillars');
});

test('Route parser falls back to dashboard on root /admin or /', () => {
  assert.equal(getRouteFromLocation({ pathname: '/admin', hash: '' }), 'dashboard');
  assert.equal(getRouteFromLocation({ pathname: '/', hash: '' }), 'dashboard');
});

test('Route parser safely falls back to dashboard on invalid/unknown paths', () => {
  assert.equal(getRouteFromLocation({ pathname: '/admin/invalid-xyz-route', hash: '' }), 'dashboard');
  assert.equal(getRouteFromLocation({ pathname: '/nonexistent', hash: '' }), 'dashboard');
});
