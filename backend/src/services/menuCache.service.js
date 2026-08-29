const TTL_MS = 5 * 60 * 1000;
const menus = new Map();

function cacheEnabled() {
  return process.env.NODE_ENV !== 'production' && !process.env.VERCEL;
}

export function readPublicMenuCache(slug) {
  if (!cacheEnabled()) {
    return null;
  }
  const entry = menus.get(slug);

  if (!entry) {
    return null;
  }

  if (Date.now() - entry.at > TTL_MS) {
    menus.delete(slug);
    return null;
  }

  return entry;
}

export function writePublicMenuCache(slug, cafeId, data) {
  if (!cacheEnabled()) {
    return;
  }

  menus.set(slug, {
    cafeId,
    data,
    at: Date.now(),
  });
}

export function invalidatePublicMenu(cafeId, slugs = []) {
  if (cafeId) {
    for (const [key, entry] of menus) {
      if (entry.cafeId === cafeId) {
        menus.delete(key);
      }
    }
  }

  for (const slug of slugs) {
    if (slug) {
      menus.delete(slug);
    }
  }
}
