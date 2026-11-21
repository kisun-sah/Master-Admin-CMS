/**
 * Master Admin CMS — Admin API Client
 * Determines API origin based on environment or production hostname.
 */
function resolveApiBase() {
  if (typeof import.meta !== 'undefined') {
    if (import.meta.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    }
    if (import.meta.env?.VITE_BACKEND_URL) {
      return `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '')}/api/v1`;
    }
  }

  // Auto-detect production Render deployment hostname
  if (typeof window !== 'undefined' && window.location.hostname === 'kbrdigital.onrender.com') {
    return 'https://kbr-digital-api.onrender.com/api/v1';
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

  const defaultHeaders = {
    Accept: 'application/json',
  };

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
