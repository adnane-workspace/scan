import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slug.js';
import { normalizeImageUrl } from './storage.service.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

function toCafeResponse(cafe) {
  return {
    _id: cafe.id,
    name: cafe.name,
    description: cafe.description,
    logo: cafe.logo || '',
    address: cafe.address,
    phone: cafe.phone,
    slug: cafe.slug,
    isActive: cafe.isActive,
    createdAt: cafe.createdAt,
    updatedAt: cafe.updatedAt,
  };
}

export async function getMyCafe(user) {
  const cafeId = requireCafeId(user);
  const cafe = await prisma.cafe.findUnique({ where: { id: cafeId } });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found');
  }

  return toCafeResponse(cafe);
}

export async function updateMyCafe(user, payload) {
  const cafeId = requireCafeId(user);
  const data = {};

  if (payload.name !== undefined) {
    data.name = payload.name;
  }

  if (payload.description !== undefined) {
    data.description = payload.description;
  }

  if (payload.logo !== undefined) {
    data.logo = normalizeImageUrl(payload.logo);
  }

  if (payload.address !== undefined) {
    data.address = payload.address;
  }

  if (payload.phone !== undefined) {
    data.phone = payload.phone;
  }

  if (payload.slug !== undefined) {
    const nextSlug = slugify(payload.slug);

    if (!nextSlug) {
      throw new ApiError(400, 'A valid cafe slug is required');
    }

    const taken = await prisma.cafe.findFirst({
      where: { slug: nextSlug, id: { not: cafeId } },
      select: { id: true },
    });

    if (taken) {
      throw new ApiError(409, 'Cafe slug already in use');
    }

    data.slug = nextSlug;
  }

  const cafe = await prisma.cafe.update({
    where: { id: cafeId },
    data,
  });

  return toCafeResponse(cafe);
}
