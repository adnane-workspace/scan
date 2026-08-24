import { prisma } from '../config/prisma.js';

const ACTIVITY_ACTIONS = [
  'cafe_created',
  'cafe_activated',
  'cafe_deactivated',
  'cafe_password_reset',
  'cafe_updated',
  'auth_login',
  'auth_password_changed',
];

export async function recordActivity({ action, actorId, cafeId, metadata } = {}) {
  if (!ACTIVITY_ACTIONS.includes(action)) {
    return;
  }

  try {
    await prisma.activityLog.create({
      data: {
        action,
        actorId: actorId || null,
        cafeId: cafeId || null,
        metadata: metadata || undefined,
      },
    });
  } catch (error) {
    console.error('Failed to record activity', error);
  }
}

export async function listActivityLogs({ action, cafeId, from, to, limit = 200 } = {}) {
  const where = {};

  if (action && ACTIVITY_ACTIONS.includes(action)) {
    where.action = action;
  }

  if (cafeId) {
    where.cafeId = cafeId;
  }

  if (from || to) {
    where.createdAt = {};

    if (from) {
      where.createdAt.gte = new Date(`${from}T00:00:00`);
    }

    if (to) {
      where.createdAt.lte = new Date(`${to}T23:59:59.999`);
    }
  }

  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: Math.min(Number(limit) || 200, 500),
    include: {
      actor: {
        select: { id: true, name: true, email: true, role: true },
      },
      cafe: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return logs.map((log) => ({
    _id: log.id,
    action: log.action,
    createdAt: log.createdAt,
    metadata: log.metadata || {},
    actor: log.actor
      ? {
          _id: log.actor.id,
          name: log.actor.name,
          email: log.actor.email,
          role: log.actor.role,
        }
      : null,
    cafe: log.cafe
      ? {
          _id: log.cafe.id,
          name: log.cafe.name,
          slug: log.cafe.slug,
        }
      : null,
  }));
}
