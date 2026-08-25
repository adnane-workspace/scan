import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slug.js';
import { recordActivity } from './activity.service.js';
import { findPendingQrRequest, toQrStatus } from './qr.service.js';
import { normalizeImageUrl } from './storage.service.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

function toCafeResponse(cafe, pendingRequest) {
  return {
    _id: cafe.id,
    name: cafe.name,
    description: cafe.description,
    logo: cafe.logo || '',
    cover: cafe.cover || '',
    address: cafe.address,
    phone: cafe.phone,
    latitude: cafe.latitude,
    longitude: cafe.longitude,
    slug: cafe.slug,
    isActive: cafe.isActive,
    createdAt: cafe.createdAt,
    updatedAt: cafe.updatedAt,
    qr: toQrStatus(cafe, pendingRequest),
  };
}

export async function getMyCafe(user) {
  const cafeId = requireCafeId(user);
  const cafe = await prisma.cafe.findUnique({ where: { id: cafeId } });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found');
  }

  const pending = await findPendingQrRequest(cafeId);
  return toCafeResponse(cafe, pending);
}

export async function updateMyCafe(user, payload) {
  const cafeId = requireCafeId(user);
  const current = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: {
      id: true,
      slug: true,
      qrGeneratedAt: true,
      qrChangeAllowed: true,
    },
  });

  if (!current) {
    throw new ApiError(404, 'Cafe not found');
  }

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

  if (payload.cover !== undefined) {
    data.cover = normalizeImageUrl(payload.cover);
  }

  if (payload.address !== undefined) {
    data.address = payload.address;
  }

  if (payload.phone !== undefined) {
    data.phone = payload.phone;
  }

  if (payload.latitude !== undefined) {
    data.latitude = payload.latitude;
  }

  if (payload.longitude !== undefined) {
    data.longitude = payload.longitude;
  }

  if (payload.slug !== undefined) {
    const nextSlug = slugify(payload.slug);

    if (!nextSlug) {
      throw new ApiError(400, 'A valid cafe slug is required');
    }

    if (nextSlug !== current.slug) {
      const slugLocked = Boolean(current.qrGeneratedAt) && !current.qrChangeAllowed;

      if (slugLocked) {
        throw new ApiError(
          409,
          'Le lien public est verrouillé après génération du QR. Demande un changement au superadmin.',
        );
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
  }

  if (Object.keys(data).length === 0) {
    const pending = await findPendingQrRequest(cafeId);
    const cafe = await prisma.cafe.findUnique({ where: { id: cafeId } });
    return toCafeResponse(cafe, pending);
  }

  const cafe = await prisma.cafe.update({
    where: { id: cafeId },
    data,
  });

  await recordActivity({
    action: 'cafe_updated',
    actorId: user.id,
    cafeId,
    metadata: {
      cafeName: cafe.name,
      slug: cafe.slug,
      fields: Object.keys(data),
    },
  });

  const pending = await findPendingQrRequest(cafeId);
  return toCafeResponse(cafe, pending);
}
