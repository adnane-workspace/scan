export function loc(fr, _en, ar) {
  return { fr, ar: ar === undefined ? _en : ar };
}

export function pick(value, locale) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value[locale] || value.fr || '';
}

export function localizePage(page, locale) {
  const lang = locale === 'ar' ? 'ar' : 'fr';

  return {
    ...page,
    title: pick(page.title, lang),
    description: pick(page.description, lang),
    h1: pick(page.h1, lang),
    answer: pick(page.answer, lang),
    sections: (page.sections || []).map((section) => ({
      h2: pick(section.h2, lang),
      body: pick(section.body, lang),
      items: Array.isArray(section.items) ? section.items.map((item) => pick(item, lang)) : undefined,
    })),
    faq: (page.faq || []).map((item) => ({
      q: pick(item.q, lang),
      a: pick(item.a, lang),
    })),
    ctaTitle: pick(page.ctaTitle, lang),
    ctaBody: pick(page.ctaBody, lang),
  };
}

export function page(config) {
  return {
    type: 'commercial',
    parent: null,
    children: [],
    related: [],
    faq: [],
    sections: [],
    ctaTitle: loc('Créer mon menu avec Scanosh', 'Create my menu with Scanosh', 'أنشئ قائمتك مع Scanosh'),
    ctaBody: loc(
      'Inscription gratuite : catégories, photos, prix et QR code, sans réimprimer.',
      'Free signup: categories, photos, prices and a QR code — no reprinting.',
      'تسجيل مجاني: تصنيفات وصور وأسعار ورمز QR، دون إعادة طباعة.',
    ),
    ...config,
  };
}
