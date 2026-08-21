export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const TOKEN_STORAGE_KEY = 'digital-menu-token';
export const USER_STORAGE_KEY = 'digital-menu-user';

export function getPublicMenuUrl(slug) {
  if (!slug) {
    return '';
  }

  const origin = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '');
  return `${origin}/menu/${slug}`;
}
