import { useEffect, useState } from 'react';
import { getPublicMenu } from '../services/menu.service.js';
import { APP_NAME } from '../utils/constants.js';

const CACHE_TTL_MS = 20 * 1000;
const menuCache = new Map();

function readCache(slug) {
  const entry = menuCache.get(slug);

  if (!entry) {
    return null;
  }

  if (Date.now() - entry.at > CACHE_TTL_MS) {
    menuCache.delete(slug);
    return null;
  }

  return entry.data;
}

function writeCache(slug, data) {
  menuCache.set(slug, { data, at: Date.now() });
}

export function clearPublicMenuCache(slug) {
  if (slug) {
    menuCache.delete(slug);
    return;
  }

  menuCache.clear();
}

export function countPublicProducts(categories = []) {
  return categories.reduce(
    (total, category) => total + (category.products?.length || 0) + countPublicProducts(category.children || []),
    0,
  );
}

export function setPageMeta({ title, description, robots = 'index,follow' }) {
  document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;

  let meta = document.querySelector('meta[name="description"]');

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }

  meta.content = description;

  let robotsMeta = document.querySelector('meta[name="robots"]');

  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    document.head.appendChild(robotsMeta);
  }

  robotsMeta.content = robots;
}

export function usePublicMenu(slug) {
  const cached = readCache(slug);
  const [menu, setMenu] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const existing = readCache(slug);

    if (existing) {
      setMenu(existing);
      setLoading(false);
      setErrorStatus(null);
    } else {
      setLoading(true);
      setErrorStatus(null);
    }

    getPublicMenu(slug)
      .then((data) => {
        writeCache(slug, data);

        if (!cancelled) {
          setMenu(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMenu(null);
          setErrorStatus(error.response?.status || 500);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { menu, loading, errorStatus };
}
