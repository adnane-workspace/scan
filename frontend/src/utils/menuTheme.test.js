import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveMenuThemeTokens, isDarkBackdrop, relativeLuminance } from './menuTheme.js';

test('relativeLuminance classifies light and dark colors', () => {
  assert.ok(relativeLuminance('#f4f2ee') > 0.8);
  assert.ok(relativeLuminance('#0d1b2a') < 0.1);
});

test('deriveMenuThemeTokens adapts chrome for dark image backdrops', () => {
  const tokens = deriveMenuThemeTokens({ luminance: 0.2, hasImage: true });

  assert.equal(tokens.colorScheme, 'dark');
  assert.equal(tokens['--color-on-surface'], '#f7f6f3');
  assert.notEqual(tokens['--menu-overlay'], 'rgba(13, 27, 42, 0)');
});

test('deriveMenuThemeTokens keeps light chrome on pale color backgrounds', () => {
  const tokens = deriveMenuThemeTokens({
    luminance: relativeLuminance('#f4f2ee'),
    hasImage: false,
    backgroundColor: '#f4f2ee',
  });

  assert.equal(tokens.colorScheme, 'light');
  assert.equal(tokens['--color-on-surface'], '#0d1b2a');
  assert.equal(tokens['--menu-overlay'], 'rgba(13, 27, 42, 0)');
});

test('isDarkBackdrop uses a lower threshold for photos', () => {
  assert.equal(isDarkBackdrop(0.5, { hasImage: false }), true);
  assert.equal(isDarkBackdrop(0.5, { hasImage: true }), false);
});
