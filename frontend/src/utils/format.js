const CATEGORY_BADGES = [
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-primary-container text-on-primary-container",
  "bg-surface-variant text-on-surface-variant",
];

export function formatPrice(value) {
  return `${Number(value).toFixed(2)} €`;
}

export function formatDate(value) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString('fr-FR', {
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
