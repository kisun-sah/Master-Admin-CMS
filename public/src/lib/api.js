/**
 * Master Admin CMS — Dynamic Public API Client
 * Connects directly to backend /api/v1/public/* (all 21 endpoints)
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1/public';
const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Resolves static or uploaded media paths to fully qualified URLs
 */
export function resolveMediaUrl(url) {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  // Remove leading slash if any to normalize
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${BACKEND_ORIGIN}${cleanPath}`;
}

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    const err = new Error(errorData.error?.message || errorData.message || 'API request failed');
    err.status = response.status;
    err.data = errorData;
    throw err;
  }

  const result = await response.json();
  return result.data !== undefined ? result.data : result;
}

// 1. Settings & Branding
export async function getSettings() {
  return fetchJson('/settings');
}

// 2. Navigation Menus
export async function getNavigation() {
  return fetchJson('/navigation');
}

// 3. Hero Sliders & 35MB Video Showreel
export async function getSliders() {
  return fetchJson('/sliders');
}

// 4. Services
export async function getServices() {
  return fetchJson('/services');
}

export async function getServiceBySlug(slug) {
  try {
    return await fetchJson(`/services/${slug}`);
  } catch (err) {
    // Fallback: fetch all services and find by slug if dedicated endpoint isn't enabled
    const all = await fetchJson('/services');
    const matched = all.find((s) => s.slug === slug);
    if (!matched) throw err;
    return matched;
  }
}

// 5. Dynamic CMS Pages (4 layouts, 9 block types)
export async function getPageBySlug(slug) {
  return fetchJson(`/pages/${slug}`);
}

// 6. Project & Template Photo Gallery (3 endpoints)
export async function getGalleryAlbums() {
  return fetchJson('/gallery');
}

export async function getGalleryAlbumBySlug(slug) {
  return fetchJson(`/gallery/${slug}`);
}

export async function getGalleryImages() {
  return fetchJson('/gallery-images');
}

// 7. Blog & Insights
export async function getBlogs() {
  return fetchJson('/blogs');
}

export async function getBlogBySlug(slug) {
  return fetchJson(`/blogs/${slug}`);
}

// 8. Founder & Team Directory
export async function getTeam() {
  return fetchJson('/team');
}

// 9. Client Testimonials
export async function getTestimonials() {
  return fetchJson('/testimonials');
}

// 10. Tech Stack & Partner Marquee
export async function getPartners() {
  return fetchJson('/partners');
}

// 11. Careers & Job Vacancies
export async function getCareers() {
  return fetchJson('/careers');
}

export async function getCareerBySlug(slug) {
  return fetchJson(`/careers/${slug}`);
}

// Submit job application with 35MB CV upload
export async function submitJobApplication(slug, formData) {
  const url = `${API_BASE}/careers/${slug}/applications`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData, // multipart/form-data without explicit Content-Type header
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || result.message || 'Application submission failed');
  }
  return result;
}

// 12. Buyer FAQs
export async function getFaqs() {
  return fetchJson('/faqs');
}

// 13. Lead-Gen Marketing Popups
export async function getActivePopup() {
  return fetchJson('/popups/active');
}

// 14. Hire Me / Order Website Contact Form
export async function submitContact(data) {
  return fetchJson('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
