import { API_URL, getPublicMenuUrl } from './constants.js';

export function buildMenuDeepLink({ slug, categoryId, productId }) {
  const base = String(getPublicMenuUrl(slug) || '').replace(/\/$/, '');

  if (!base) {
    return '';
  }

  if (!categoryId) {
    return `${base}/categories`;
  }

  const url = `${base}/${categoryId}`;
  return productId ? `${url}?product=${encodeURIComponent(productId)}` : url;
}

export function buildShareUrl({ slug, categoryId, productId }) {
  const params = new URLSearchParams();

  if (categoryId) {
    params.set('category', categoryId);
  }

  if (productId) {
    params.set('product', productId);
  }

  const query = params.toString();
  return `${API_URL}/share/${encodeURIComponent(slug)}${query ? `?${query}` : ''}`;
}

export async function shareOrCopy({ title, text, url }) {
  if (!url) {
    throw new Error('missing-url');
  }

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') {
        return 'cancelled';
      }
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return 'copied';
  }

  throw new Error('share-failed');
}
