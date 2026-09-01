import { isMenuSectionKey, SECTIONS_MAX_DEPTH } from '../../src/utils/menuSections.js';

describe('menuSections', () => {
  test('isMenuSectionKey accepts restaurant and cafe', () => {
    expect(isMenuSectionKey('restaurant')).toBe(true);
    expect(isMenuSectionKey('cafe')).toBe(true);
    expect(isMenuSectionKey('bar')).toBe(false);
  });

  test('sections max depth is 2', () => {
    expect(SECTIONS_MAX_DEPTH).toBe(2);
  });
});
