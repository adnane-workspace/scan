import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiError } from './ApiError.js';
import { assertUsableSlug, slugify } from './slug.js';

test('assertUsableSlug accepts a normal cafe slug', () => {
  assert.doesNotThrow(() => assertUsableSlug(slugify('Café Central')));
});

test('assertUsableSlug rejects empty slugs', () => {
  assert.throws(() => assertUsableSlug(''), (error) => {
    assert.equal(error instanceof ApiError, true);
    assert.equal(error.code, 'INVALID_SLUG');
    assert.equal(error.statusCode, 400);
    return true;
  });
});

test('assertUsableSlug rejects reserved subdomains', () => {
  assert.throws(() => assertUsableSlug('app'), (error) => {
    assert.equal(error instanceof ApiError, true);
    assert.equal(error.code, 'SLUG_RESERVED');
    assert.equal(error.statusCode, 400);
    return true;
  });
});
