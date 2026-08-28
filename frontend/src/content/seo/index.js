import { blogPages } from './blog.js';
import { dashboardChildPages, featurePages } from './features.js';
import { localizePage } from './helpers.js';
import { extraPages, localPages } from './local.js';
import { pillarPages } from './pillars.js';
import { qrPages } from './qr.js';

export const SEO_PAGES = [
  ...pillarPages,
  ...featurePages,
  ...dashboardChildPages,
  ...qrPages,
  ...blogPages,
  ...localPages,
  ...extraPages,
];

const byPath = new Map(SEO_PAGES.map((item) => [item.path, item]));

export function getSeoPage(path) {
  const normalised = String(path || '').replace(/\/$/, '') || '/';
  return byPath.get(normalised) || null;
}

export function getSeoPaths() {
  return SEO_PAGES.map((item) => item.path);
}

const CUSTOM_SEO_PATHS = new Set(['/tarifs', '/contact']);

export function getSeoDocumentPaths() {
  return getSeoPaths().filter((path) => !CUSTOM_SEO_PATHS.has(path));
}

export function getBlogArticles() {
  return SEO_PAGES.filter((item) => item.type === 'article');
}

export function resolveSeoPage(path, locale) {
  const page = getSeoPage(path);

  if (!page) {
    return null;
  }

  const resolved = localizePage(page, locale);
  resolved.children = (page.children || []).map((childPath) => {
    const child = getSeoPage(childPath);
    return child ? { path: childPath, title: localizePage(child, locale).h1 } : { path: childPath, title: childPath };
  });
  resolved.related = (page.related || [])
    .map((relatedPath) => {
      const related = getSeoPage(relatedPath);

      if (related) {
        return { path: relatedPath, title: localizePage(related, locale).h1 };
      }

      if (relatedPath === '/register') {
        return { path: '/register', title: locale === 'ar' ? 'تسجيل' : locale === 'en' ? 'Sign up' : 'Inscription' };
      }

      return null;
    })
    .filter(Boolean);

  resolved.breadcrumbs = buildBreadcrumbs(page, locale);
  return resolved;
}

function buildBreadcrumbs(page, locale) {
  const homeLabel = locale === 'ar' ? 'الرئيسية' : locale === 'en' ? 'Home' : 'Accueil';
  const items = [{ path: '/', name: homeLabel }];
  const chain = [];
  let current = page;

  while (current) {
    chain.unshift(current);
    current = current.parent ? getSeoPage(current.parent) : null;
  }

  for (const node of chain) {
    const local = localizePage(node, locale);
    items.push({ path: node.path, name: local.h1 });
  }

  return items;
}
