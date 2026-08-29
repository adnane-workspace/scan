const TTL_MS = 5 * 60 * 1000;
const menus = new Map();

export function readPublicMenuCache(slug) {
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
