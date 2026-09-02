import { env } from '../config/env.js';
import { stripCloudinaryTransforms } from '../utils/cloudinaryUrl.js';
import { isMenuSectionKey } from '../utils/menuSections.js';
import { getPublicMenu } from './menu.service.js';

function findProduct(nodes, productId) {
  for (const node of nodes || []) {
    const match = (node.products || []).find((item) => String(item.id) === String(productId));

    if (match) {
      return { category: node, product: match };
    }

    const nested = findProduct(node.children, productId);

    if (nested) {
      return nested;
    }
  }

  return null;
}

function findCategory(nodes, categoryId) {
  for (const node of nodes || []) {
    if (String(node.id) === String(categoryId)) {
      return node;
    }

    const nested = findCategory(node.children, categoryId);

    if (nested) {
      return nested;
    }
  }

  return null;
}

function firstCover(category) {
  if (category?.image) {
    return category.image;
  }

  for (const product of category?.products || []) {
    if (product.image) {
      return product.image;
    }
  }

  for (const child of category?.children || []) {
    const nested = firstCover(child);

    if (nested) {
      return nested;
    }
  }

  return '';
}

function formatPrice(value) {
  const amount = new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

  return `${amount} DH`;
}

function ogImage(url) {
  const value = String(url || '').trim();

  if (!value) {
    return '';
  }

  if (value.includes('res.cloudinary.com') && value.includes('/upload/')) {
    const clean = stripCloudinaryTransforms(value);
    return clean.replace('/upload/', '/upload/w_1200,h_630,c_fill,g_auto,f_jpg,q_auto/');
  }

  return value;
}

function clientOrigin() {
  return String(env.CLIENT_URL || '')
    .split(',')[0]
    .trim()
    .replace(/\/$/, '');
}

export function menuDeepLink(slug, { sectionKey, categoryId, productId } = {}) {
  const isProd = env.NODE_ENV === 'production';
  let url = isProd ? `https://${slug}.${env.ROOT_DOMAIN}` : `${clientOrigin()}/menu/${slug}`;

  if (sectionKey && isMenuSectionKey(sectionKey)) {
    url += `/${sectionKey}`;

    if (categoryId) {
      url += `/${categoryId}`;
    }
  } else if (categoryId) {
    url += `/${categoryId}`;
  }

  if (productId) {
    url += `?product=${encodeURIComponent(productId)}`;
  }

  return url;
}

export async function getSharePreview(slug, { sectionKey, categoryId, productId } = {}) {
  const menu = await getPublicMenu(slug);
  const cafe = menu.cafe;
  const sectionsEnabled = true;
  let category = categoryId ? findCategory(menu.categories, categoryId) : null;

  if (!category && categoryId) {
    for (const section of menu.sections || []) {
      const match = section.children?.find((item) => String(item.id) === String(categoryId));

      if (match) {
        category = match;
        sectionKey = sectionKey || section.key;
        break;
      }
    }
  }

  const foundProduct = productId ? findProduct(category ? [category] : menu.categories, productId) : null;
  const product = foundProduct?.product || null;

  if (categoryId && !category) {
    return null;
  }

  if (productId && !product) {
    return null;
  }

  const image = ogImage(product?.image || firstCover(category) || cafe.cover || cafe.logo);
  const target = menuDeepLink(slug, {
    sectionKey: sectionsEnabled ? sectionKey : null,
    categoryId: category?.id,
    productId: product?.id,
  });

  if (product) {
    return {
      title: `${product.name} · ${cafe.name}`,
      description: [product.description, formatPrice(product.price), cafe.name].filter(Boolean).join(' · '),
      image,
      target,
    };
  }

  if (category) {
    return {
      title: `${category.name} · ${cafe.name}`,
      description: cafe.description || `Catégorie ${category.name} — ${cafe.name}`,
      image,
      target,
    };
  }

  return {
    title: cafe.name,
    description: cafe.description || `Menu de ${cafe.name}`,
    image: ogImage(cafe.cover || cafe.logo),
    target,
  };
}
