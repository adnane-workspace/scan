import { APP_NAME, getSiteOrigin } from './constants.js';

export function organizationJsonLd() {
  const origin = getSiteOrigin();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: origin || 'https://www.scanosh.com',
    logo: origin ? `${origin}/1.svg` : '/1.svg',
  };
}

export function softwareJsonLd(description) {
  const origin = getSiteOrigin();

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: origin ? `${origin}/` : 'https://www.scanosh.com/',
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MAD',
    },
  };
}

export function breadcrumbJsonLd(items) {
  const origin = getSiteOrigin();

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: origin ? `${origin}${item.path}` : item.path,
    })),
  };
}

export function faqJsonLd(faq) {
  if (!faq?.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function restaurantJsonLd(cafe, slug) {
  const origin = getSiteOrigin();
  const url = origin ? `${origin}/menu/${slug}` : `/menu/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: cafe.name,
    description: cafe.description || undefined,
    url,
    image: cafe.cover || cafe.logo || undefined,
    telephone: cafe.phone || undefined,
    address: cafe.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: cafe.address,
          addressCountry: 'MA',
        }
      : undefined,
    geo:
      cafe.latitude != null && cafe.longitude != null
        ? {
            '@type': 'GeoCoordinates',
            latitude: cafe.latitude,
            longitude: cafe.longitude,
          }
        : undefined,
    hasMenu: url,
  };
}
