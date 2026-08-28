import { ApiError } from './ApiError.js';
import { isReservedSubdomain } from './reservedSubdomains.js';

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function assertUsableSlug(slug) {
  if (!slug) {
    throw new ApiError(400, 'A valid cafe slug is required', null, 'INVALID_SLUG');
  }

  if (isReservedSubdomain(slug)) {
    throw new ApiError(400, 'This public identifier is reserved', null, 'SLUG_RESERVED');
  }
}
