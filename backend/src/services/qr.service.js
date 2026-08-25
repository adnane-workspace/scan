import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { recordActivity } from './activity.service.js';
import { sendQrChangeRequestAlert } from './mail.service.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

export function toPendingRequest(request) {
  if (!request) {
    return null;
  }

  return {
    _id: request.id,
    reason: request.reason,
    status: request.status,
    createdAt: request.createdAt,
    reviewNote: request.reviewNote || '',
    reviewedAt: request.reviewedAt || null,
  };
}

export function toQrStatus(cafe, pendingRequest) {
  const generated = Boolean(cafe.qrGeneratedAt);
  const changeAllowed = Boolean(cafe.qrChangeAllowed);
  const locked = generated && !changeAllowed;

  return {
    generated,
    generatedAt: cafe.qrGeneratedAt || null,
    locked,
    changeAllowed,
    canGenerate: !generated || changeAllowed,
    pendingRequest: toPendingRequest(pendingRequest),
  };
}

export async function findPendingQrRequest(cafeId) {
  return prisma.qrChangeRequest.findFirst({
    where: { cafeId, status: 'pending' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      reason: true,
      status: true,
      createdAt: true,
      reviewNote: true,
      reviewedAt: true,
    },
  });
}

export async function getQrStatusForCafe(cafeId) {
  const [cafe, pending] = await Promise.all([
    prisma.cafe.findUnique({
      where: { id: cafeId },
      select: { qrGeneratedAt: true, qrChangeAllowed: true },
    }),
    findPendingQrRequest(cafeId),
  ]);

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found');
  }

  return toQrStatus(cafe, pending);
}

function toRequestResponse(request) {
  return {
    _id: request.id,
    reason: request.reason,
    status: request.status,
    reviewNote: request.reviewNote || '',
    reviewedAt: request.reviewedAt || null,
    createdAt: request.createdAt,
    cafe: request.cafe
      ? {
          _id: request.cafe.id,
          name: request.cafe.name,
          slug: request.cafe.slug,
        }
      : null,
    requester: request.requester
      ? {
          _id: request.requester.id,
          name: request.requester.name,
          email: request.requester.email,
        }
      : null,
    reviewer: request.reviewer
      ? {
          _id: request.reviewer.id,
          name: request.reviewer.name,
          email: request.reviewer.email,
        }
      : null,
  };
}

export async function generateCafeQr(user) {
  const cafeId = requireCafeId(user);
  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: {
      id: true,
      name: true,
      slug: true,
      qrGeneratedAt: true,
      qrChangeAllowed: true,
    },
  });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found');
  }

  const canGenerate = !cafe.qrGeneratedAt || cafe.qrChangeAllowed;

  if (!canGenerate) {
    throw new ApiError(409, 'Le QR code a déjà été généré. Demande un changement au superadmin.');
  }

  const updated = await prisma.cafe.update({
    where: { id: cafeId },
    data: {
      qrGeneratedAt: new Date(),
      qrChangeAllowed: false,
    },
    select: {
      qrGeneratedAt: true,
      qrChangeAllowed: true,
    },
  });

  await recordActivity({
    action: 'qr_generated',
    actorId: user.id,
    cafeId,
    metadata: {
      cafeName: cafe.name,
      slug: cafe.slug,
      regenerated: Boolean(cafe.qrGeneratedAt),
    },
  });

  const pending = await findPendingQrRequest(cafeId);
  return toQrStatus(updated, pending);
}

export async function requestQrChange(user, reason) {
  const cafeId = requireCafeId(user);
  const trimmed = String(reason || '').trim();

  if (!trimmed) {
    throw new ApiError(400, 'Indique la raison du changement');
  }

  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: {
      id: true,
      name: true,
      slug: true,
      qrGeneratedAt: true,
      qrChangeAllowed: true,
    },
  });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found');
  }

  if (!cafe.qrGeneratedAt) {
    throw new ApiError(400, 'Génère d’abord le QR code');
  }

  if (cafe.qrChangeAllowed) {
    throw new ApiError(400, 'Un changement est déjà autorisé. Génère le nouveau QR code.');
  }

  const existing = await findPendingQrRequest(cafeId);

  if (existing) {
    throw new ApiError(409, 'Une demande de changement est déjà en attente');
  }

  const request = await prisma.qrChangeRequest.create({
    data: {
      cafeId,
      requesterId: user.id,
      reason: trimmed,
    },
    select: {
      id: true,
      reason: true,
      status: true,
      createdAt: true,
      reviewNote: true,
      reviewedAt: true,
    },
  });

  await recordActivity({
    action: 'qr_change_requested',
    actorId: user.id,
    cafeId,
    metadata: {
      cafeName: cafe.name,
      slug: cafe.slug,
      reason: trimmed,
    },
  });

  await notifySuperAdminsOfQrChange({
    cafeName: cafe.name,
    slug: cafe.slug,
    requesterName: user.name,
    requesterEmail: user.email,
    reason: trimmed,
  });

  return toQrStatus(cafe, request);
}

async function notifySuperAdminsOfQrChange(payload) {
  const superadmins = await prisma.user.findMany({
    where: { role: 'superadmin' },
    select: { email: true },
  });
  const recipients = [...new Set(superadmins.map((item) => item.email).filter(Boolean))];

  if (recipients.length === 0) {
    console.warn('QR change request saved but no superadmin email was found');
    return;
  }

  const results = await Promise.allSettled(
    recipients.map((to) => sendQrChangeRequestAlert({ to, ...payload })),
  );
  const failed = results.filter((item) => item.status === 'rejected');

  if (failed.length > 0) {
    console.error(
      `QR change email failed for ${failed.length}/${recipients.length} superadmin(s)`,
      failed[0].reason?.message || failed[0].reason,
    );
  }
}

export async function listQrChangeRequests(status) {
  const where = {};

  if (status && status !== 'all') {
    where.status = status;
  }

  const rank = { pending: 0, approved: 1, rejected: 2 };
  const requests = await prisma.qrChangeRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      cafe: {
        select: { id: true, name: true, slug: true },
      },
      requester: {
        select: { id: true, name: true, email: true },
      },
      reviewer: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const pendingCount = await prisma.qrChangeRequest.count({ where: { status: 'pending' } });
  const sorted = [...requests].sort((left, right) => {
    const diff = (rank[left.status] ?? 9) - (rank[right.status] ?? 9);
    if (diff !== 0) {
      return diff;
    }

    return new Date(right.createdAt) - new Date(left.createdAt);
  });

  return {
    requests: sorted.map(toRequestResponse),
    pendingCount,
  };
}

export async function reviewQrChangeRequest(requestId, { decision, note }, actor) {
  if (decision !== 'approved' && decision !== 'rejected') {
    throw new ApiError(400, 'Décision invalide');
  }

  const request = await prisma.qrChangeRequest.findUnique({
    where: { id: requestId },
    include: {
      cafe: {
        select: { id: true, name: true, slug: true, qrChangeAllowed: true },
      },
    },
  });

  if (!request) {
    throw new ApiError(404, 'Demande introuvable');
  }

  if (request.status !== 'pending') {
    throw new ApiError(409, 'Cette demande a déjà été traitée');
  }

  const reviewNote = String(note || '').trim();
  const now = new Date();

  const [updated] = await prisma.$transaction([
    prisma.qrChangeRequest.update({
      where: { id: requestId },
      data: {
        status: decision,
        reviewerId: actor.id,
        reviewNote,
        reviewedAt: now,
      },
      include: {
        cafe: {
          select: { id: true, name: true, slug: true },
        },
        requester: {
          select: { id: true, name: true, email: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.cafe.update({
      where: { id: request.cafeId },
      data: {
        qrChangeAllowed: decision === 'approved',
      },
    }),
  ]);

  await recordActivity({
    action: decision === 'approved' ? 'qr_change_approved' : 'qr_change_rejected',
    actorId: actor.id,
    cafeId: request.cafeId,
    metadata: {
      cafeName: request.cafe?.name,
      slug: request.cafe?.slug,
      reason: request.reason,
      note: reviewNote,
    },
  });

  return toRequestResponse(updated);
}

export async function unlockCafeQr(cafeId, actor) {
  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: { id: true, name: true, slug: true, qrGeneratedAt: true },
  });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found');
  }

  if (!cafe.qrGeneratedAt) {
    throw new ApiError(400, 'Ce café n’a pas encore généré de QR code');
  }

  const pending = await findPendingQrRequest(cafeId);

  await prisma.$transaction(async (tx) => {
    await tx.cafe.update({
      where: { id: cafeId },
      data: { qrChangeAllowed: true },
    });

    if (pending) {
      await tx.qrChangeRequest.update({
        where: { id: pending.id },
        data: {
          status: 'approved',
          reviewerId: actor.id,
          reviewNote: 'Déverrouillage manuel',
          reviewedAt: new Date(),
        },
      });
    }
  });

  await recordActivity({
    action: 'qr_change_approved',
    actorId: actor.id,
    cafeId,
    metadata: {
      cafeName: cafe.name,
      slug: cafe.slug,
      note: 'Déverrouillage manuel',
      manual: true,
    },
  });

  return getQrStatusForCafe(cafeId);
}
