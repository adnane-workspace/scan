import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slug.js';
import { generateToken } from '../utils/token.js';
import { recordActivity } from './activity.service.js';
import { sendPasswordResetCode } from './mail.service.js';

function toPublicUser(user) {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    cafeId: user.cafeId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    await recordActivity({
      action: 'auth_login_failed',
      metadata: { email: normalizedEmail, reason: 'invalid_credentials' },
    });
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    await recordActivity({
      action: 'auth_login_failed',
      actorId: user.id,
      cafeId: user.cafeId,
      metadata: { email: user.email, reason: 'invalid_credentials' },
    });
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    await recordActivity({
      action: 'auth_login_failed',
      actorId: user.id,
      cafeId: user.cafeId,
      metadata: { email: user.email, reason: 'forbidden_role' },
    });
    throw new ApiError(403, 'Admin access required');
  }

  if (user.role === 'admin') {
    if (!user.cafeId) {
      await recordActivity({
        action: 'auth_login_failed',
        actorId: user.id,
        metadata: { email: user.email, reason: 'no_cafe' },
      });
      throw new ApiError(403, 'No cafe associated with this account');
    }

    const cafe = await prisma.cafe.findUnique({
      where: { id: user.cafeId },
      select: { isActive: true },
    });

    if (!cafe || !cafe.isActive) {
      await recordActivity({
        action: 'auth_login_failed',
        actorId: user.id,
        cafeId: user.cafeId,
        metadata: { email: user.email, reason: 'cafe_disabled' },
      });
      throw new ApiError(403, 'Ce café est désactivé');
    }
  }

  const token = generateToken({
    sub: user.id,
    role: user.role,
    cafeId: user.cafeId,
  });

  return {
    token,
    user: toPublicUser(user),
  };
}

export function getCurrentUser(user) {
  if (!user) {
    throw new ApiError(401, 'Authentication required');
  }

  return toPublicUser({
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    cafeId: user.cafeId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

export async function register({ name, email, password, cafeName, slug }) {
  const normalizedEmail = email.toLowerCase();
  const cafeSlug = slugify(slug || cafeName);

  if (!cafeSlug) {
    throw new ApiError(400, 'A valid cafe slug is required');
  }

  const [existingEmail, existingSlug] = await Promise.all([
    prisma.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } }),
    prisma.cafe.findUnique({ where: { slug: cafeSlug }, select: { id: true } }),
  ]);

  if (existingEmail) {
    throw new ApiError(409, 'Email already in use');
  }

  if (existingSlug) {
    throw new ApiError(409, 'Cafe slug already in use');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { user } = await prisma.$transaction(async (tx) => {
    const cafe = await tx.cafe.create({
      data: {
        name: cafeName.trim(),
        slug: cafeSlug,
      },
    });

    const createdUser = await tx.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'admin',
        cafeId: cafe.id,
      },
    });

    return { cafe, user: createdUser };
  });

  await recordActivity({
    action: 'cafe_created',
    actorId: user.id,
    cafeId: user.cafeId,
    metadata: {
      cafeName: cafeName.trim(),
      slug: cafeSlug,
      ownerName: name.trim(),
      ownerEmail: normalizedEmail,
      source: 'register',
    },
  });

  const token = generateToken({
    sub: user.id,
    role: user.role,
    cafeId: user.cafeId,
  });

  return {
    token,
    user: toPublicUser(user),
  };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(401, 'Authentication required');
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isValidPassword) {
    throw new ApiError(400, 'Mot de passe actuel incorrect');
  }

  if (currentPassword === newPassword) {
    throw new ApiError(400, 'Le nouveau mot de passe doit être différent');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await recordActivity({
    action: 'auth_password_changed',
    actorId: user.id,
    cafeId: user.cafeId,
    metadata: {
      email: user.email,
      role: user.role,
    },
  });
}

const RESET_TTL_MS = 10 * 60 * 1000;
const RESET_RESEND_MS = 60 * 1000;
const RESET_MAX_PER_HOUR = 5;
const RESET_MAX_ATTEMPTS = 5;

function hashResetCode(email, code) {
  return createHash('sha256').update(`${email}:${code}:${env.JWT_SECRET}`).digest('hex');
}

function codesMatch(expectedHash, email, code) {
  const actual = hashResetCode(email, code);
  const expectedBuffer = Buffer.from(expectedHash, 'utf8');
  const actualBuffer = Buffer.from(actual, 'utf8');

  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

async function findActiveReset(email) {
  return prisma.passwordReset.findFirst({
    where: {
      email,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function requestPasswordReset({ email, locale = 'fr' }) {
  const normalizedEmail = email.toLowerCase();
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const recent = await prisma.passwordReset.findMany({
    where: { email: normalizedEmail, createdAt: { gte: hourAgo } },
    orderBy: { createdAt: 'desc' },
    take: RESET_MAX_PER_HOUR,
  });

  const latest = recent[0];

  if (latest && now.getTime() - latest.createdAt.getTime() < RESET_RESEND_MS) {
    const retryAfter = Math.ceil((RESET_RESEND_MS - (now.getTime() - latest.createdAt.getTime())) / 1000);
    return { retryAfter };
  }

  if (recent.length >= RESET_MAX_PER_HOUR) {
    return { retryAfter: 3600 };
  }

  await prisma.passwordReset.updateMany({
    where: { email: normalizedEmail, consumedAt: null },
    data: { consumedAt: now },
  });

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, email: true },
  });

  const code = String(randomInt(100000, 1000000));

  await prisma.passwordReset.create({
    data: {
      email: normalizedEmail,
      userId: user?.id || null,
      codeHash: hashResetCode(normalizedEmail, code),
      expiresAt: new Date(now.getTime() + RESET_TTL_MS),
    },
  });

  if (user) {
    const channel = await sendPasswordResetCode({ to: user.email, code, locale });
    if (channel !== 'log') {
      console.info(`[password-reset] email sent via ${channel} to ${user.email}`);
    }
  }

  return { retryAfter: RESET_RESEND_MS / 1000 };
}

export async function verifyPasswordResetCode({ email, code }) {
  const normalizedEmail = email.toLowerCase();
  const reset = await findActiveReset(normalizedEmail);

  if (!reset || !codesMatch(reset.codeHash, normalizedEmail, code)) {
    if (reset) {
      const attempts = reset.attempts + 1;
      await prisma.passwordReset.update({
        where: { id: reset.id },
        data: {
          attempts,
          ...(attempts >= RESET_MAX_ATTEMPTS ? { consumedAt: new Date() } : {}),
        },
      });
    }

    throw new ApiError(400, 'Code invalide ou expiré');
  }

  return { valid: true };
}

export async function resetPasswordWithCode({ email, code, newPassword }) {
  const normalizedEmail = email.toLowerCase();
  const reset = await findActiveReset(normalizedEmail);

  if (!reset || !codesMatch(reset.codeHash, normalizedEmail, code)) {
    if (reset) {
      const attempts = reset.attempts + 1;
      await prisma.passwordReset.update({
        where: { id: reset.id },
        data: {
          attempts,
          ...(attempts >= RESET_MAX_ATTEMPTS ? { consumedAt: new Date() } : {}),
        },
      });
    }

    throw new ApiError(400, 'Code invalide ou expiré');
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { consumedAt: new Date() },
    });
    throw new ApiError(400, 'Code invalide ou expiré');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.passwordReset.update({
      where: { id: reset.id },
      data: { consumedAt: new Date() },
    }),
    prisma.passwordReset.updateMany({
      where: { email: normalizedEmail, consumedAt: null, id: { not: reset.id } },
      data: { consumedAt: new Date() },
    }),
  ]);

  await recordActivity({
    action: 'auth_password_changed',
    actorId: user.id,
    cafeId: user.cafeId,
    metadata: {
      email: user.email,
      role: user.role,
      source: 'forgot',
    },
  });
}

export function logout() {
  return {
    success: true,
    message: 'Logged out successfully',
  };
}
