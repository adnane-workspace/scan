/**
 * Send a test verification email. Usage:
 *   node scripts/test-mail.mjs you@example.com
 */
import { sendEmailVerificationCode } from '../src/services/mail.service.js';
import { env } from '../src/config/env.js';

const to = process.argv[2];
if (!to) {
  console.error('Usage: node scripts/test-mail.mjs <recipient-email>');
  process.exit(1);
}

const code = '123456';
console.info(`Sending test verification email to ${to}…`);
console.info(`MAIL_FROM=${env.MAIL_FROM}`);
console.info(`SMTP_HOST=${env.SMTP_HOST || '(none)'}`);
console.info(`SMTP_USER=${env.SMTP_USER || '(none)'}`);
console.info(`RESEND_API_KEY=${env.RESEND_API_KEY ? '(set)' : '(none)'}`);

try {
  const channel = await sendEmailVerificationCode({ to, code, locale: 'fr' });
  console.info(`OK — sent via ${channel}`);
} catch (error) {
  console.error('FAILED:', error.message);
  if (error.details) console.error(error.details);
  process.exit(1);
}
