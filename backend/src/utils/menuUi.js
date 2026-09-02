export const DEFAULT_MENU_UI = {
  theme: 'dark',
  showPhone: true,
  showAddress: true,
  showLanguage: true,
  sectionsEnabled: true,
  sectionVisibility: {
    restaurant: true,
    cafe: true,
  },
  bgMode: 'color',
  backgroundColor: '#f4f2ee',
  backgroundImage: '',
};

export const DEFAULT_MENU_BACKGROUND = '#f4f2ee';

export const THEME_BACKGROUNDS = {
  light: '#e0e1dd',
  dark: '#0d1b2a',
};

const HEX_COLOR = /^#?([0-9a-fA-F]{6})$/;
const BG_MODES = new Set(['color', 'image']);

export function themeBackground(theme) {
  return theme === 'light' ? THEME_BACKGROUNDS.light : THEME_BACKGROUNDS.dark;
}

export function normalizeHexColor(value) {
  const match = String(value || '').trim().match(HEX_COLOR);
  return match ? `#${match[1].toLowerCase()}` : '';
}

export function normalizeSectionVisibility(value) {
  const raw = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const result = {
    restaurant: true,
    cafe: true,
  };

  for (const [key, entry] of Object.entries(raw)) {
    const slug = String(key || '').trim();

    if (!slug) {
      continue;
    }

    result[slug] = entry !== false;
  }

  return result;
}

export function normalizeMenuUi(value) {
  const raw = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const backgroundImage = typeof raw.backgroundImage === 'string' ? raw.backgroundImage.trim().slice(0, 2048) : '';
  const backgroundColor = normalizeHexColor(raw.backgroundColor) || DEFAULT_MENU_BACKGROUND;

  let bgMode = BG_MODES.has(raw.bgMode) ? raw.bgMode : 'color';

  if (raw.bgMode === 'default') {
    bgMode = 'color';
  }

  return {
    theme: raw.theme === 'light' ? 'light' : 'dark',
    showPhone: raw.showPhone !== false,
    showAddress: raw.showAddress !== false,
    showLanguage: raw.showLanguage !== false,
    sectionsEnabled: true,
    sectionVisibility: normalizeSectionVisibility(raw.sectionVisibility),
    bgMode,
    backgroundColor,
    backgroundImage,
  };
}

export function finalizeMenuUi(value) {
  const ui = normalizeMenuUi(value);

  if (ui.bgMode === 'image' && !ui.backgroundImage) {
    return { ...ui, bgMode: 'color' };
  }

  return ui;
}
