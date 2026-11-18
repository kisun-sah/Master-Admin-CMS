import { ApiError } from './ApiError.js';

/**
 * Shared low-level HTTP transport client.
 * Features:
 * - Configurable timeout (default 30,000ms) with clean AbortController integration
 * - Supports external `signal` chaining for component unmount cancellation
 * - Automatic offline detection via `navigator.onLine`
 * - Safe JSON parsing with fallback
 * - Normalized ApiError instances
 */
export async function httpClient(url, options = {}) {
  // Check if browser is strictly offline
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new ApiError('You appear to be offline. Please check your internet connection.', 0, 'OFFLINE_ERROR');
  }

  const {
    timeout = 30000,
    signal: externalSignal,
    ...fetchOptions
  } = options;

  const isFormData = fetchOptions.body instanceof FormData;

  // Set up combined abort controller for timeout and caller cancellation
  const controller = new AbortController();
  let timerId = null;

  if (timeout > 0) {
    timerId = setTimeout(() => {
      controller.abort(new Error(`Request timed out after ${timeout}ms`));
    }, timeout);
  }

  // Chain external signal if provided
  if (externalSignal) {
    if (externalSignal.aborted) {
      if (timerId) clearTimeout(timerId);
      throw new ApiError('Request was aborted by caller', 0, 'ABORT_ERROR');
    }
    externalSignal.addEventListener('abort', () => {
      controller.abort(externalSignal.reason);
    });
  }

  const config = {
    ...fetchOptions,
    signal: controller.signal,
    headers: {
      Accept: 'application/json',
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...fetchOptions.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (timerId) clearTimeout(timerId);

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (parseErr) {
        data = { message: 'Malformed JSON response from server' };
      }
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.message ||
        (typeof data === 'string' && data) ||
        `HTTP Error ${response.status}`;

      throw new ApiError(
        message,
        response.status,
        data?.error?.code || `HTTP_${response.status}`,
        data?.error?.details || null
      );
    }

    return data;
  } catch (error) {
    if (timerId) clearTimeout(timerId);

    if (error instanceof ApiError) {
      throw error;
    }

    // Handle aborts (timeout or unmount)
    if (error.name === 'AbortError' || controller.signal.aborted) {
      const isTimeout = controller.signal.reason?.message?.includes('timed out');
      throw new ApiError(
        isTimeout ? `Request timed out after ${timeout}ms` : 'Request was cancelled',
        0,
        isTimeout ? 'TIMEOUT_ERROR' : 'ABORT_ERROR'
      );
    }

    throw new ApiError(error.message || 'Network request failed', 0, 'NETWORK_ERROR');
  }
}
