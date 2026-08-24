import { prisma } from '../config/prisma.js';

export const ACTIVITY_ACTIONS = [
  'cafe_created',
  'cafe_activated',
  'cafe_deactivated',
  'cafe_password_reset',
  'cafe_updated',
  'auth_login_failed',
  'auth_password_changed',
  'product_deleted',
  'category_deleted',
];

const CAFE_ACTIONS = [
  'cafe_created',
  'cafe_activated',
  'cafe_deactivated',
  'cafe_password_reset',
  'cafe_updated',
];

const SECURITY_ACTIONS = ['auth_login_failed', 'auth_password_changed'];
const DELETE_ACTIONS = ['product_deleted', 'category_deleted'];

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

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function listActivityLogs({ action, cafeId, from, to, limit = 300 } = {}) {
  const where = {
    action: { in: ACTIVITY_ACTIONS },
  };

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

  const take = Math.min(Number(limit) || 300, 500);
  const today = startOfToday();

  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      actor: {
        select: { id: true, name: true, email: true, role: true },
      },
      cafe: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  const startToday = today.getTime();
  let total = logs.length;

  try {
    total = await prisma.activityLog.count({ where });
  } catch {
    total = logs.length;
  }

  const todayCount = logs.filter((log) => new Date(log.createdAt).getTime() >= startToday).length;
  const cafeCount = logs.filter((log) => CAFE_ACTIONS.includes(log.action)).length;
  const securityCount = logs.filter((log) => SECURITY_ACTIONS.includes(log.action)).length;
  const deletedCount = logs.filter((log) => DELETE_ACTIONS.includes(log.action)).length;

  return {
    logs: logs.map((log) => ({
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
    })),
    summary: {
      shown: logs.length,
      total,
      today: todayCount,
      cafes: cafeCount,
      security: securityCount,
      deletions: deletedCount,
    },
  };
}
