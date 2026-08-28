import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isAllowedBrowserOrigin } from './origins.js';

const clientOrigins = ['https://www.scanosh.com', 'https://scanosh.com', 'https://app.scanosh.com'];
const opts = { clientOrigins, rootDomain: 'scanosh.com', nodeEnv: 'production' };

test('isAllowedBrowserOrigin allows listed site origins and empty origin', () => {
  assert.equal(isAllowedBrowserOrigin('', opts), true);
  assert.equal(isAllowedBrowserOrigin('https://www.scanosh.com', opts), true);
  assert.equal(isAllowedBrowserOrigin('https://app.scanosh.com', opts), true);
});

test('isAllowedBrowserOrigin allows cafe tenants on the root domain', () => {
  assert.equal(isAllowedBrowserOrigin('https://cafe-central.scanosh.com', opts), true);
  assert.equal(isAllowedBrowserOrigin('https://snack-12.scanosh.com', opts), true);
});

test('isAllowedBrowserOrigin rejects nested labels and foreign hosts', () => {
  assert.equal(isAllowedBrowserOrigin('https://a.b.scanosh.com', opts), false);
  assert.equal(isAllowedBrowserOrigin('https://scanosh.com.evil.com', opts), false);
  assert.equal(isAllowedBrowserOrigin('https://evil.com', opts), false);
  assert.equal(isAllowedBrowserOrigin('http://cafe-central.scanosh.com', opts), false);
});

test('isAllowedBrowserOrigin allows *.localhost only outside production', () => {
  assert.equal(isAllowedBrowserOrigin('http://cafe-central.localhost:5173', opts), false);
  assert.equal(
    isAllowedBrowserOrigin('http://cafe-central.localhost:5173', { ...opts, nodeEnv: 'development' }),
    true,
  );
  assert.equal(
    isAllowedBrowserOrigin('http://app.localhost:5173', { ...opts, nodeEnv: 'development' }),
    true,
  );
});
