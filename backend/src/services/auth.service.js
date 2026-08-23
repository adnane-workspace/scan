import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slug.js';
import { generateToken } from '../utils/token.js';

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
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    throw new ApiError(403, 'Admin access required');
  }

  if (user.role === 'admin') {
    if (!user.cafeId) {
      throw new ApiError(403, 'No cafe associated with this account');
    }

    const cafe = await prisma.cafe.findUnique({
      where: { id: user.cafeId },
      select: { isActive: true },
    });

    if (!cafe || !cafe.isActive) {
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

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      cafeId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(401, 'Authentication required');
  }

  return toPublicUser(user);
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
}

export function logout() {
  return {
    success: true,
    message: 'Logged out successfully',
  };
}
