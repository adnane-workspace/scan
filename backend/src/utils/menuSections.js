export const MENU_SECTION_KEYS = ['restaurant', 'cafe'];

export const SECTIONS_MAX_DEPTH = 2;

export function isMenuSectionKey(value) {
  return MENU_SECTION_KEYS.includes(String(value || '').toLowerCase());
}
