const CATEGORY_BADGES = [
  "bg-[#F0E6D8] text-[#5F625E]",
  "bg-[#E4F0E8] text-[#2C5A3E]",
  "bg-[#F7EDE3] text-[#873A06]",
  "bg-[#EBE6DC] text-[#6F716D]",
];

const INTL_LOCALE = {
  fr: 'fr-FR',
  en: 'en-US',
  ar: 'ar-MA',
};

const BYTE_UNITS = {
  fr: ['o', 'Ko', 'Mo', 'Go', 'To'],
  en: ['B', 'KB', 'MB', 'GB', 'TB'],
  ar: ['بايت', 'ك.ب', 'م.ب', 'ج.ب', 'ت.ب'],
};

function intlLocale(locale) {
  return INTL_LOCALE[locale] || INTL_LOCALE.fr;
}

export function formatBytes(bytes, locale = 'fr') {
  const value = Number(bytes) || 0;
  const units = BYTE_UNITS[locale] || BYTE_UNITS.fr;

  if (value <= 0) {
    return `0 ${units[0]}`;
  }

  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const amount = value / 1024 ** exponent;
  const formatted = new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: exponent === 0 ? 0 : amount >= 100 ? 0 : 2,
  }).format(amount);

  return `${formatted} ${units[exponent]}`;
}

export function formatCount(value, locale = 'fr', digits = 0) {
  return new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);
}

export function formatPrice(value, locale = 'fr') {
  const amount = new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));

  return `${amount} DH`;
}

export function formatRelativeTime(value, locale = 'fr') {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  const language = locale === 'en' || locale === 'ar' ? locale : 'fr';
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 1) {
    if (language === 'en') {
      return 'just now';
    }

    if (language === 'ar') {
      return 'الآن';
    }

    return 'à l’instant';
  }

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(-diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return formatter.format(-diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffDays) < 7) {
    return formatter.format(-diffDays, 'day');
  }

  return formatDateTime(value, locale);
}

export function formatDateTime(value, locale = 'fr') {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString(intlLocale(locale), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(value, locale = 'fr') {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString(intlLocale(locale), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function categoryBadgeClass(name, available = true) {
  if (!available) {
    return "bg-surface-variant text-on-surface-variant";
  }

  const source = name || "";
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash + source.charCodeAt(index) * (index + 1)) % CATEGORY_BADGES.length;
  }

  return CATEGORY_BADGES[hash];
}

export function firstName(name, fallback = "Admin") {
  const value = String(name || "").trim();
  return value.split(/\s+/)[0] || fallback;
}

const CATEGORY_ICONS = [
  { test: /petit.?d[ée]jeuner|breakfast|brunch|فطور/i, icon: "bakery_dining" },
  { test: /caf[ée]|espresso|coffee|قهوة/i, icon: "local_cafe" },
  { test: /entr[ée]|tapas|partage|مقبلات/i, icon: "tapas" },
  { test: /plat|principal|d[ée]jeuner|lunch|أطباق/i, icon: "restaurant" },
  { test: /dessert|g[aâ]teau|chocolat|sucr|حلويات/i, icon: "icecream" },
  { test: /cocktail|boisson|drink|bar|مشروبات/i, icon: "local_bar" },
];

export function categoryIcon(name) {
  const match = CATEGORY_ICONS.find((item) => item.test.test(name || ""));
  return match?.icon || "category";
}
