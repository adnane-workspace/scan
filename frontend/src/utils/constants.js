function normalizeApiUrl(url) {
  let value = (url || 'http://localhost:5000/api').trim().replace(/\/$/, '');

  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }

  if (!value.endsWith('/api')) {
    value = `${value}/api`;
  }

  return value;
}

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);
export const TOKEN_STORAGE_KEY = 'digital-menu-token';
export const USER_STORAGE_KEY = 'digital-menu-user';

export function getPublicMenuUrl(slug) {
  if (!slug) {
    return '';
  }

  const origin = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '');
  return `${origin}/menu/${slug}`;
}
