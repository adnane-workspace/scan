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

function migrateStorageKey(from, to) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (window.localStorage.getItem(to) != null) {
      window.localStorage.removeItem(from);
      return;
    }

    const legacy = window.localStorage.getItem(from);

    if (legacy != null) {
      window.localStorage.setItem(to, legacy);
      window.localStorage.removeItem(from);
    }
  } catch {
    // Ignore private-mode / blocked storage.
  }
}

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);
export const APP_NAME = 'QTable';
export const DEVELOPER_NAME = 'Adnan Elmenouar';
export const DEVELOPER_URL = 'https://elmenouar.linkmakeup.com/';
export const TOKEN_STORAGE_KEY = 'qtable-token';
export const USER_STORAGE_KEY = 'qtable-user';
export const LOCALE_STORAGE_KEY = 'qtable-locale';

migrateStorageKey('digital-menu-token', TOKEN_STORAGE_KEY);
migrateStorageKey('digital-menu-user', USER_STORAGE_KEY);
migrateStorageKey('digital-menu-locale', LOCALE_STORAGE_KEY);

export function getPublicMenuUrl(slug) {
  if (!slug) {
    return '';
  }

  const origin = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '');
  return `${origin}/menu/${slug}`;
}
