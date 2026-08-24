const CATEGORY_BADGES = [
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-primary-container text-on-primary-container",
  "bg-surface-variant text-on-surface-variant",
];

export function formatBytes(bytes, locale = 'fr') {
  const value = Number(bytes) || 0;
  const units = locale === 'en' ? ['B', 'KB', 'MB', 'GB', 'TB'] : ['o', 'Ko', 'Mo', 'Go', 'To'];

  if (value <= 0) {
    return `0 ${units[0]}`;
  }

  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const amount = value / 1024 ** exponent;
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    maximumFractionDigits: exponent === 0 ? 0 : amount >= 100 ? 0 : 2,
  }).format(amount);

  return `${formatted} ${units[exponent]}`;
}

export function formatCount(value, locale = 'fr', digits = 0) {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);
}

export function formatPrice(value, locale = 'fr') {
  const amount = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
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
  const language = locale === 'en' ? 'en' : 'fr';
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 1) {
    return language === 'en' ? 'just now' : 'à l’instant';
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

  return new Date(value).toLocaleString(locale === 'en' ? 'en-GB' : 'fr-FR', {
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

  return new Date(value).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
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
  { test: /petit.?d[ée]jeuner|breakfast|brunch/i, icon: "bakery_dining" },
  { test: /caf[ée]|espresso|coffee/i, icon: "local_cafe" },
  { test: /entr[ée]|tapas|partage/i, icon: "tapas" },
  { test: /plat|principal|d[ée]jeuner|lunch/i, icon: "restaurant" },
  { test: /dessert|g[aâ]teau|chocolat|sucr/i, icon: "icecream" },
  { test: /cocktail|boisson|drink|bar/i, icon: "local_bar" },
];

export function categoryIcon(name) {
  const match = CATEGORY_ICONS.find((item) => item.test.test(name || ""));
  return match?.icon || "category";
}
