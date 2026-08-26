import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getHomePath, mapLegacyDashboardPath } from './paths.js';

test('getHomePath sends cafe admins to /app and superadmins to /platform', () => {
  assert.equal(getHomePath({ role: 'superadmin' }), '/platform');
  assert.equal(getHomePath({ role: 'admin' }), '/app');
  assert.equal(getHomePath(null), '/app');
});

test('mapLegacyDashboardPath keeps bookmarks working', () => {
  assert.equal(mapLegacyDashboardPath('/dashboard', { role: 'admin' }), '/app');
  assert.equal(mapLegacyDashboardPath('/dashboard', { role: 'superadmin' }), '/platform');
  assert.equal(mapLegacyDashboardPath('/dashboard/products', { role: 'admin' }), '/app/products');
  assert.equal(mapLegacyDashboardPath('/dashboard/cafes/abc', { role: 'superadmin' }), '/platform/cafes/abc');
  assert.equal(mapLegacyDashboardPath('/dashboard/settings', { role: 'admin' }), '/app/settings');
  assert.equal(mapLegacyDashboardPath('/dashboard/settings', { role: 'superadmin' }), '/platform/settings');
});
