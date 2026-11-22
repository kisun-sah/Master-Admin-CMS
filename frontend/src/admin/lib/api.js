function normalizeOrigin(origin) {
  if (!origin) return '';
  let clean = origin.trim().replace(/\/+$/, '');
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  return clean;
}

/**
 * Master Admin CMS — Admin API Client
 * Determines API origin based on environment or production hostname.
 */
export function resolveBackendOrigin() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) {
    return normalizeOrigin(import.meta.env.VITE_BACKEND_URL);
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'kbrdigital.onrender.com') {
      return 'https://kbr-digital-api.onrender.com';
    }
    // If browsing via LAN IP or hostname (e.g. 192.168.18.212:5173), point backend to that same host on port 5000
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `http://${window.location.hostname}:5000`;
    }
  }
  return 'http://localhost:5000';
}

/**
 * Resolves static or uploaded media paths to fully qualified URLs in Admin UI
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
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${resolveBackendOrigin()}${cleanPath}`;
}

function resolveApiBase() {
  if (typeof import.meta !== 'undefined') {
    if (import.meta.env?.VITE_API_URL) {
      return normalizeOrigin(import.meta.env.VITE_API_URL);
    }
    if (import.meta.env?.VITE_BACKEND_URL) {
      const origin = normalizeOrigin(import.meta.env.VITE_BACKEND_URL);
      return `${origin}/api/v1`;
    }
  }

  // Auto-detect production Render deployment hostname
  if (typeof window !== 'undefined' && window.location.hostname === 'kbrdigital.onrender.com') {
    return 'https://kbr-digital-api.onrender.com/api/v1';
  }

  // If browsing via LAN IP (e.g. 192.168.18.212:5173), point directly to backend API on that LAN IP port 5000
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5000/api/v1`;
  }

  // Local development default (proxied by Vite dev server to localhost:5000)
  return '/api/v1';
}

const API_BASE = resolveApiBase();

export async function apiRequest(endpoint, options = {}) {
  let url;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    url = endpoint;
  } else {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Prevent duplicate /api/v1 when calling endpoints that already include it
    if (cleanEndpoint.startsWith('/api/v1')) {
      const baseOrigin = API_BASE.replace(/\/api\/v1$/, '');
      url = baseOrigin ? `${baseOrigin}${cleanEndpoint}` : cleanEndpoint;
    } else {
      url = `${API_BASE}${cleanEndpoint}`;
    }
  }

  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
    url = `https://${url}`;
  }

  const defaultHeaders = {
    Accept: 'application/json',
  };

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('cms_auth_token') : null;
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
    defaultHeaders['X-Session-Id'] = token;
  }

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Essential for cookie authentication
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');

    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cms:auth-expired'));
      }

      const errorMessage =
        (data && data.error && data.error.message) ||
        (typeof data === 'string' && data) ||
        `HTTP Error ${response.status}`;
      const err = new Error(errorMessage);
      err.status = response.status;
      err.code = data?.error?.code;
      err.details = data?.error?.details;
      throw err;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const api = {
  get: (endpoint, params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest(`${endpoint}${qs}`, { method: 'GET' });
  },

  post: (endpoint, body) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put: (endpoint, body) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  patch: (endpoint, body) => {
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete: (endpoint) => {
    return apiRequest(endpoint, { method: 'DELETE' });
  },
};
