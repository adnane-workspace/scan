import { useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale.js';
import { APP_NAME, getSiteOrigin } from '../../utils/constants.js';
import { LANDING_FEATURES, LANDING_PRODUCT } from '../../utils/paths.js';

function upsertMeta(attr, key, content) {
  if (!content) {
    return;
  }

  let node = document.head.querySelector(`meta[${attr}="${key}"]`);

  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }

  node.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let node = document.head.querySelector(`link[rel="${rel}"]`);

  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', rel);
    document.head.appendChild(node);
  }

  node.setAttribute('href', href);
}

function seoCopy(path, t) {
  if (path === LANDING_FEATURES) {
    return {
      title: t('landing.seoFeaturesTitle', { name: APP_NAME }),
      description: t('landing.seoFeaturesDescription'),
    };
  }

  if (path === LANDING_PRODUCT) {
    return {
      title: t('landing.seoProductTitle', { name: APP_NAME }),
      description: t('landing.seoProductDescription'),
    };
  }

  return {
    title: t('landing.seoHomeTitle', { name: APP_NAME }),
    description: t('landing.seoHomeDescription'),
  };
}

export default function LandingSeo({ path }) {
  const { t, locale } = useLocale();
  const origin = getSiteOrigin();
  const canonicalPath = path === '/' ? '/' : path;
  const canonical = `${origin}${canonicalPath}`;
  const { title, description } = seoCopy(path, t);
  const image = `${origin}/landing/hero.jpg`;

  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:locale', locale === 'ar' ? 'ar_AR' : locale === 'en' ? 'en_US' : 'fr_FR');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertLink('canonical', canonical);
  }, [canonical, description, image, locale, title]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${origin}/`,
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
