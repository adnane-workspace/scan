import { useEffect, useState } from 'react';
import { getPublicMenu } from '../services/menu.service.js';

export function setPageMeta({ title, description }) {
  document.title = title;

  let meta = document.querySelector('meta[name="description"]');

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }

  meta.content = description;
}

export function usePublicMenu(slug) {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrorStatus(null);

    getPublicMenu(slug)
      .then((data) => {
        if (!cancelled) {
          setMenu(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
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
      document.title = 'Digital Menu';
    };
  }, [slug]);

  return { menu, loading, errorStatus };
}
