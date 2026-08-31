import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const COPY = {
  fr: {
    subject: 'Votre code de vérification Scanosh',
    title: 'Code de vérification',
    intro: 'Utilisez ce code pour réinitialiser le mot de passe de votre espace Scanosh.',
    valid: 'Ce code expire dans 10 minutes. Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.',
  },
  ar: {
    subject: 'رمز التحقق من Scanosh',
    title: 'رمز التحقق',
    intro: 'استخدم هذا الرمز لإعادة تعيين كلمة مرور فضاء Scanosh.',
    valid: 'ينتهي هذا الرمز خلال 10 دقائق. إذا لم تطلبه، يمكنك تجاهل هذا البريد.',
  },
};

const VERIFY_COPY = {
  fr: {
    subject: 'Confirmez votre email Scanosh',
    title: 'Confirmer l’email',
    intro: 'Utilisez ce code pour activer votre espace Scanosh. Un email = un compte.',
    valid: 'Ce code expire dans 10 minutes. Si vous n’êtes pas à l’origine de cette inscription, ignorez cet email.',
  },
  ar: {
    subject: 'أكّد بريدك على Scanosh',
    title: 'تأكيد البريد',
    intro: 'استخدم هذا الرمز لتفعيل فضاء Scanosh. بريد واحد = حساب واحد.',
    valid: 'ينتهي هذا الرمز خلال 10 دقائق. إذا لم تنشئ هذا الحساب، تجاهل هذا البريد.',
  },
};

function resolveMailLocale(locale) {
  return locale === 'ar' ? 'ar' : 'fr';
}

function buildCodeEmail(code, locale, copyMap) {
  const copy = copyMap[resolveMailLocale(locale)] || copyMap.fr;
  const text = `${copy.intro}\n\n${code}\n\n${copy.valid}`;
  const html = `
    <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:#0d1b2a;padding:32px;color:#e0e1dd">
      <p style="letter-spacing:.18em;text-transform:uppercase;font-size:12px;color:#e0e1dd;margin:0 0 16px">Scanosh</p>
      <h1 style="font-size:28px;margin:0 0 12px">${copy.title}</h1>
      <p style="margin:0 0 24px;color:#e0e1ddb8;line-height:1.5">${copy.intro}</p>
      <p style="font-size:36px;letter-spacing:.28em;font-weight:700;margin:0 0 24px">${code}</p>
      <p style="margin:0;color:#e0e1dd8f;font-size:14px;line-height:1.5">${copy.valid}</p>
    </div>
  `;

  return { subject: copy.subject, text, html };
}

function buildResetEmail(code, locale) {
  return buildCodeEmail(code, locale, COPY);
}

function dashboardOrigin() {
  return env.CLIENT_URL.split(',')[0].trim().replace(/\/$/, '') || 'http://localhost:5173';
}

function buildQrChangeEmail({ cafeName, slug, requesterName, requesterEmail, reason }) {
  const reviewUrl = `${dashboardOrigin()}/platform/qr-requests`;
  const subject = `Demande de changement de QR — ${cafeName}`;
  const text = [
    `${requesterName} (${requesterEmail}) demande un changement de QR pour ${cafeName} (/${slug}).`,
    '',
    `Raison : ${reason}`,
    '',
    `Traiter la demande : ${reviewUrl}`,
  ].join('\n');
  const html = `
    <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:#0d1b2a;padding:32px;color:#e0e1dd">
      <p style="letter-spacing:.18em;text-transform:uppercase;font-size:12px;color:#e0e1dd;margin:0 0 16px">Scanosh</p>
      <h1 style="font-size:28px;margin:0 0 12px">Changement de QR</h1>
      <p style="margin:0 0 16px;color:#e0e1ddb8;line-height:1.5">
        <strong style="color:#e0e1dd">${escapeHtml(requesterName)}</strong>
        (${escapeHtml(requesterEmail)}) demande un nouveau QR pour
        <strong style="color:#e0e1dd">${escapeHtml(cafeName)}</strong>
        (/${escapeHtml(slug)}).
      </p>
      <p style="margin:0 0 24px;color:#e0e1ddb8;line-height:1.5">
        <span style="display:block;letter-spacing:.12em;text-transform:uppercase;font-size:11px;color:#e0e1dd;margin-bottom:8px">Raison</span>
        ${escapeHtml(reason)}
      </p>
      <p style="margin:0 0 24px">
        <a href="${reviewUrl}" style="display:inline-block;background:#e0e1dd;color:#0d1b2a;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:700">
          Voir la demande
        </a>
      </p>
      <p style="margin:0;color:#e0e1dd8f;font-size:14px;line-height:1.5">${reviewUrl}</p>
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
    throw new ApiError(503, 'Email is not configured', null, 'EMAIL_NOT_CONFIGURED');
  }

  console.info(`[mail] to=${payload.to} subject=${payload.subject}\n${payload.text}`);
  return 'log';
}

function parseResendError(details) {
  try {
    const payload = typeof details === 'string' ? JSON.parse(details) : details;
    const message = String(payload?.message || '');

    if (message.includes('testing email address') || message.includes('example.com')) {
      return new ApiError(
        422,
        'Cette adresse email ne peut pas recevoir de messages (domaine de test). Utilise une vraie adresse Gmail, Outlook, etc.',
        details,
        'EMAIL_RECIPIENT_BLOCKED',
      );
    }

    if (message) {
      return new ApiError(502, `Resend: ${message}`, details, 'EMAIL_SEND_FAILED');
    }
  } catch {
    // Fall through to generic error.
  }

  return new ApiError(502, 'Unable to send email', details, 'EMAIL_SEND_FAILED');
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
      reply_to: 'contact@scanosh.com',
      subject,
      html,
      text,
    }),
  });

  const details = await response.text();

  if (!response.ok) {
    console.error('Resend send failed:', details);
    throw parseResendError(details);
  }

  try {
    const { id } = JSON.parse(details);
    if (id) {
      console.info(`[resend] queued id=${id} to=${to} from=${env.MAIL_FROM}`);
    }
  } catch {
    console.info(`[resend] queued to=${to} from=${env.MAIL_FROM}`);
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
    throw new ApiError(502, 'Unable to send email. Check SMTP_USER, the Gmail app password, and MAIL_FROM.', null, 'EMAIL_SEND_FAILED');
  }
}

export async function sendPasswordResetCode({ to, code, locale = 'fr' }) {
  return dispatchEmail({
    to,
    ...buildResetEmail(code, locale),
  });
}

export async function sendEmailVerificationCode({ to, code, locale = 'fr' }) {
  return dispatchEmail({
    to,
    ...buildCodeEmail(code, locale, VERIFY_COPY),
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
