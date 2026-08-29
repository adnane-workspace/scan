export const DEFAULT_MENU_UI = {
  theme: 'dark',
  showPhone: true,
  showAddress: true,
  showLanguage: true,
  bgMode: 'default',
  backgroundColor: '',
  backgroundImage: '',
};

export const THEME_BACKGROUNDS = {
  light: '#e0e1dd',
  dark: '#0d1b2a',
};

const HEX_COLOR = /^#?([0-9a-fA-F]{6})$/;
const BG_MODES = new Set(['default', 'color', 'image']);

export function themeBackground(theme) {
  return theme === 'light' ? THEME_BACKGROUNDS.light : THEME_BACKGROUNDS.dark;
}

export function normalizeHexColor(value) {
  const match = String(value || '').trim().match(HEX_COLOR);
  return match ? `#${match[1].toLowerCase()}` : '';
}

export function normalizeMenuUi(value) {
  const raw = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const backgroundImage = typeof raw.backgroundImage === 'string' ? raw.backgroundImage.trim().slice(0, 2048) : '';
  const bgMode = BG_MODES.has(raw.bgMode) ? raw.bgMode : 'default';

  return {
    theme: raw.theme === 'light' ? 'light' : 'dark',
    showPhone: raw.showPhone !== false,
    showAddress: raw.showAddress !== false,
    showLanguage: raw.showLanguage !== false,
    bgMode,
    backgroundColor: normalizeHexColor(raw.backgroundColor),
    backgroundImage,
  };
}

export function resolveMenuBackdrop(cafe) {
  const ui = normalizeMenuUi(cafe?.menuUi);

  if (ui.bgMode === 'image' && ui.backgroundImage) {
    return { image: ui.backgroundImage, blur: false, color: '' };
  }

  if (ui.bgMode === 'color' && ui.backgroundColor) {
    return { image: '', blur: false, color: ui.backgroundColor };
  }

  if (cafe?.cover) {
    return { image: cafe.cover, blur: false, color: '' };
  }

  if (cafe?.logo) {
    return { image: cafe.logo, blur: true, color: '' };
  }

  return { image: '', blur: false, color: themeBackground(ui.theme) };
}
