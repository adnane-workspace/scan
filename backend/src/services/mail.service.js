import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const COPY = {
  fr: {
    subject: 'Votre code de vérification Epicurean',
    title: 'Code de vérification',
    intro: 'Utilisez ce code pour réinitialiser le mot de passe de votre espace Epicurean.',
    valid: 'Ce code expire dans 10 minutes. Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.',
  },
  en: {
    subject: 'Your Epicurean verification code',
    title: 'Verification code',
    intro: 'Use this code to reset the password for your Epicurean space.',
    valid: 'This code expires in 10 minutes. If you did not request it, you can ignore this email.',
  },
  ar: {
    subject: 'رمز التحقق من Epicurean',
    title: 'رمز التحقق',
    intro: 'استخدم هذا الرمز لإعادة تعيين كلمة مرور فضاء Epicurean.',
    valid: 'ينتهي هذا الرمز خلال 10 دقائق. إذا لم تطلبه، يمكنك تجاهل هذا البريد.',
  },
};

function buildResetEmail(code, locale) {
  const copy = COPY[locale] || COPY.fr;
  const text = `${copy.intro}\n\n${code}\n\n${copy.valid}`;
  const html = `
    <div style="font-family:Georgia,serif;background:#16110e;padding:32px;color:#fff8f3">
      <p style="letter-spacing:.18em;text-transform:uppercase;font-size:12px;color:#e8c27a;margin:0 0 16px">Epicurean</p>
      <h1 style="font-size:28px;margin:0 0 12px">${copy.title}</h1>
      <p style="margin:0 0 24px;color:#fff8f3c7;line-height:1.5">${copy.intro}</p>
      <p style="font-size:36px;letter-spacing:.28em;font-weight:700;margin:0 0 24px">${code}</p>
      <p style="margin:0;color:#fff8f38f;font-size:14px;line-height:1.5">${copy.valid}</p>
    </div>
  `;

  return { subject: copy.subject, text, html };
}

function dashboardOrigin() {
  return env.CLIENT_URL.split(',')[0].trim().replace(/\/$/, '') || 'http://localhost:5173';
}

function buildQrChangeEmail({ cafeName, slug, requesterName, requesterEmail, reason }) {
  const reviewUrl = `${dashboardOrigin()}/dashboard/qr-requests`;
  const subject = `Demande de changement de QR — ${cafeName}`;
  const text = [
    `${requesterName} (${requesterEmail}) demande un changement de QR pour ${cafeName} (/${slug}).`,
    '',
    `Raison : ${reason}`,
    '',
    `Traiter la demande : ${reviewUrl}`,
  ].join('\n');
  const html = `
    <div style="font-family:Georgia,serif;background:#16110e;padding:32px;color:#fff8f3">
      <p style="letter-spacing:.18em;text-transform:uppercase;font-size:12px;color:#e8c27a;margin:0 0 16px">Epicurean</p>
      <h1 style="font-size:28px;margin:0 0 12px">Changement de QR</h1>
      <p style="margin:0 0 16px;color:#fff8f3c7;line-height:1.5">
        <strong style="color:#fff8f3">${escapeHtml(requesterName)}</strong>
        (${escapeHtml(requesterEmail)}) demande un nouveau QR pour
        <strong style="color:#fff8f3">${escapeHtml(cafeName)}</strong>
        (/${escapeHtml(slug)}).
      </p>
      <p style="margin:0 0 24px;color:#fff8f3c7;line-height:1.5">
        <span style="display:block;letter-spacing:.12em;text-transform:uppercase;font-size:11px;color:#e8c27a;margin-bottom:8px">Raison</span>
        ${escapeHtml(reason)}
      </p>
      <p style="margin:0 0 24px">
        <a href="${reviewUrl}" style="display:inline-block;background:#9e3d00;color:#fff8f3;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:700">
          Voir la demande
        </a>
      </p>
      <p style="margin:0;color:#fff8f38f;font-size:14px;line-height:1.5">${reviewUrl}</p>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function dispatchEmail(payload) {
  if (env.RESEND_API_KEY) {
    await sendWithResend(payload);
    return 'resend';
  }

  if (env.SMTP_HOST) {
    await sendWithSmtp(payload);
    return 'smtp';
  }

  if (env.NODE_ENV === 'production') {
    throw new ApiError(503, 'Email is not configured');
  }

  console.info(`[mail] to=${payload.to} subject=${payload.subject}\n${payload.text}`);
  return 'log';
}

async function sendWithResend({ to, subject, html, text }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new ApiError(502, `Unable to send email (${response.status})`, details);
  }
}

let smtpTransporter = null;

function getSmtpTransporter() {
  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE || env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }

  return smtpTransporter;
}

async function sendWithSmtp({ to, subject, html, text }) {
  try {
    await getSmtpTransporter().sendMail({
      from: env.MAIL_FROM.includes('<') ? env.MAIL_FROM : `${env.MAIL_FROM} <${env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    const detail = error?.response || error?.message || 'SMTP error';
    console.error('SMTP send failed:', detail);
    throw new ApiError(502, 'Impossible d’envoyer l’email. Vérifie SMTP_USER, le mot de passe d’application Gmail, et MAIL_FROM.');
  }
}

export async function sendPasswordResetCode({ to, code, locale = 'fr' }) {
  return dispatchEmail({
    to,
    ...buildResetEmail(code, locale),
  });
}

export async function sendQrChangeRequestAlert({
  to,
  cafeName,
  slug,
  requesterName,
  requesterEmail,
  reason,
}) {
  return dispatchEmail({
    to,
    ...buildQrChangeEmail({ cafeName, slug, requesterName, requesterEmail, reason }),
  });
}
