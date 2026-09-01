import { normalizeSectionVisibility } from './menuUi.js';

export const MENU_SECTION_KEYS = ['restaurant', 'cafe'];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isMenuSectionKey(value) {
  return MENU_SECTION_KEYS.includes(String(value || '').toLowerCase());
}

export function isLegacyCategoryId(value) {
  return UUID_RE.test(String(value || ''));
}

export function getActiveSections(menu) {
  const visibility = normalizeSectionVisibility(menu?.cafe?.menuUi?.sectionVisibility);

  return (menu?.sections || []).filter(
    (section) => section.children?.length > 0 && visibility[section.key] !== false,
  );
}

export function getSectionMenuDestination(menu, paths) {
  const menuUi = menu?.cafe?.menuUi;
  const activeSections = getActiveSections(menu);

  if (!menuUi?.sectionsEnabled) {
    return paths.categories;
  }

  if (activeSections.length > 1) {
    return paths.sections;
  }

  if (activeSections.length === 1) {
    const section = activeSections[0];
    const firstCategory = section.children?.[0];

    if (firstCategory?.id) {
      return paths.sectionCategory(section.key, firstCategory.id);
    }

    return paths.section(section.key);
  }

  return paths.categories;
}

export function countSectionProducts(section) {
  return (section?.children || []).reduce(
    (total, category) => total + (category.products?.length || 0),
    0,
  );
}

export function findSectionByKey(menu, sectionKey) {
  return getActiveSections(menu).find((section) => String(section.key) === String(sectionKey)) || null;
}

export function resolveSectionCategory(section, categoryId) {
  const children = section?.children || [];

  if (!children.length) {
    return { category: null, products: [], missing: true };
  }

  if (!categoryId) {
    const category = children[0];
    return { category, products: category.products || [], missing: false };
  }

  const category = children.find((item) => String(item.id) === String(categoryId));

  if (!category) {
    return { category: null, products: [], missing: true };
  }

  return { category, products: category.products || [], missing: false };
}

export function findSectionKeyForCategory(menu, categoryId) {
  for (const section of getActiveSections(menu)) {
    const match = section.children?.find((child) => String(child.id) === String(categoryId));

    if (match) {
      return section.key;
    }
  }

  return null;
}

export function getFlatCatalogCategories(categories) {
  const items = [];

  for (const root of categories || []) {
    if (root.sectionKey && root.children?.length) {
      items.push(...root.children);
      continue;
    }

    if (!root.sectionKey) {
      items.push(root);
    }
  }

  return items;
}

export function resolveFlatSelection(categories, categoryId) {
  const list = getFlatCatalogCategories(categories);

  if (!list.length) {
    return { category: null, products: [], missing: false };
  }

  if (!categoryId) {
    const category = list[0];
    return { category, products: category.products || [], missing: false };
  }

  const matched = list.find((item) => String(item.id) === String(categoryId));

  if (!matched) {
    return { category: null, products: [], missing: true };
  }

  return { category: matched, products: matched.products || [], missing: false };
}
