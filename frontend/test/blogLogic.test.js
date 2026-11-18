import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Blog Preview fallback and deduplication logic tests
 * Simulates the algorithm implemented in HomeBlogPreview.jsx
 */

const defaultBlogs = [
  { _id: 'def-1', slug: 'nyc-mun-2026', title: 'NYC MUN 2026' },
  { _id: 'def-2', slug: 'pabsons-visit-2025', title: 'PABSON Visit' },
  { _id: 'def-3', slug: 'ghf-vietnam-2025', title: 'GHF Vietnam' },
];

function computeBlogPreviewItems(blogs) {
  const published = Array.isArray(blogs)
    ? blogs.filter((b) => !b.status || b.status === 'published')
    : [];

  const existingSlugs = new Set(published.map((b) => b.slug));
  const merged = [...published];

  for (const def of defaultBlogs) {
    if (merged.length >= 3) break;
    if (!existingSlugs.has(def.slug)) {
      merged.push(def);
      existingSlugs.add(def.slug);
    }
  }

  return merged.slice(0, 3);
}

test('computeBlogPreviewItems returns exactly 3 items when input is empty', () => {
  const result = computeBlogPreviewItems([]);
  assert.equal(result.length, 3);
  assert.equal(result[0].slug, 'nyc-mun-2026');
  assert.equal(result[1].slug, 'pabsons-visit-2025');
  assert.equal(result[2].slug, 'ghf-vietnam-2025');
});

test('computeBlogPreviewItems filters out draft status blogs', () => {
  const cmsBlogs = [
    { _id: 'b-1', slug: 'live-post-1', title: 'Live 1', status: 'published' },
    { _id: 'b-2', slug: 'draft-post-2', title: 'Draft 2', status: 'draft' },
  ];
  const result = computeBlogPreviewItems(cmsBlogs);
  assert.equal(result.length, 3);
  assert.equal(result[0].slug, 'live-post-1');
  assert.equal(result[1].slug, 'nyc-mun-2026');
  assert.equal(result[2].slug, 'pabsons-visit-2025');
  assert.ok(!result.some((b) => b.slug === 'draft-post-2'), 'Draft post must not be included');
});

test('computeBlogPreviewItems prevents duplicate slugs when CMS matches default slug', () => {
  const cmsBlogs = [
    { _id: 'b-custom', slug: 'nyc-mun-2026', title: 'My Custom NYC MUN', status: 'published' },
  ];
  const result = computeBlogPreviewItems(cmsBlogs);
  assert.equal(result.length, 3);
  assert.equal(result[0].title, 'My Custom NYC MUN');
  assert.equal(result[1].slug, 'pabsons-visit-2025');
  assert.equal(result[2].slug, 'ghf-vietnam-2025');
  // Check no duplicates
  const slugs = result.map((b) => b.slug);
  assert.equal(new Set(slugs).size, 3);
});

test('computeBlogPreviewItems uses exclusively CMS items when 3 or more published', () => {
  const cmsBlogs = [
    { _id: '1', slug: 'post-1', status: 'published' },
    { _id: '2', slug: 'post-2', status: 'published' },
    { _id: '3', slug: 'post-3', status: 'published' },
    { _id: '4', slug: 'post-4', status: 'published' },
  ];
  const result = computeBlogPreviewItems(cmsBlogs);
  assert.equal(result.length, 3);
  assert.equal(result[0].slug, 'post-1');
  assert.equal(result[1].slug, 'post-2');
  assert.equal(result[2].slug, 'post-3');
  assert.ok(!result.some((b) => b.slug.startsWith('def-')));
});
