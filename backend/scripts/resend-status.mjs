/**
 * Debug Resend delivery. Usage:
 *   node scripts/resend-status.mjs [recipient-email]
 */
import { env } from '../src/config/env.js';

const to = process.argv[2] || 'contact@scanosh.com';

if (!env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY missing');
  process.exit(1);
}

console.info('MAIL_FROM:', env.MAIL_FROM);
console.info('Testing send to:', to);

const sendRes = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: env.MAIL_FROM,
    to: [to],
    subject: 'Test Scanosh prod',
    text: 'Test Resend delivery',
    html: '<p>Test Resend delivery</p>',
  }),
});

const sendBody = await sendRes.text();
console.info('Send status:', sendRes.status);
console.info('Send body:', sendBody);

const listRes = await fetch('https://api.resend.com/emails?limit=5', {
  headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
});
const listBody = await listRes.text();
console.info('\nRecent emails status:', listRes.status);
console.info(listBody);
