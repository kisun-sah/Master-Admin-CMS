import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError } from '../src/shared/api/ApiError.js';
import { httpClient } from '../src/shared/api/httpClient.js';

test('ApiError properly stores status, code, and details', () => {
  const err = new ApiError('Not found', 404, 'NOT_FOUND', { field: 'slug' });
  assert.equal(err.message, 'Not found');
  assert.equal(err.status, 404);
  assert.equal(err.code, 'NOT_FOUND');
  assert.deepEqual(err.details, { field: 'slug' });
  assert.equal(err.isApiError, true);
});

test('httpClient throws ApiError with OFFLINE_ERROR when navigator.onLine is false', async () => {
  const originalNavigator = globalThis.navigator;
  globalThis.navigator = { onLine: false };

  try {
    await httpClient('http://example.com/test');
    assert.fail('Should have thrown an error');
  } catch (err) {
    assert.equal(err instanceof ApiError, true);
    assert.equal(err.code, 'OFFLINE_ERROR');
    assert.equal(err.status, 0);
  } finally {
    globalThis.navigator = originalNavigator;
  }
});

test('httpClient respects timeout and throws TIMEOUT_ERROR', async () => {
  const originalFetch = globalThis.fetch;
  // Mock fetch that hangs longer than timeout
  globalThis.fetch = () => new Promise((resolve) => setTimeout(resolve, 500));

  try {
    await httpClient('http://example.com/hang', { timeout: 50 });
    assert.fail('Should have timed out');
  } catch (err) {
    assert.equal(err instanceof ApiError, true);
    assert.equal(err.code, 'TIMEOUT_ERROR');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('httpClient parses JSON and normalizes error messages on 400', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 400,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({
      error: { code: 'INVALID_INPUT', message: 'Email address is required' },
    }),
  });

  try {
    await httpClient('http://example.com/error-400', { timeout: 1000 });
    assert.fail('Should have thrown 400');
  } catch (err) {
    assert.equal(err instanceof ApiError, true);
    assert.equal(err.status, 400);
    assert.equal(err.code, 'INVALID_INPUT');
    assert.equal(err.message, 'Email address is required');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
