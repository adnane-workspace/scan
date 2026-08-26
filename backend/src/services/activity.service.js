import { prisma } from '../config/prisma.js';

export const ACTIVITY_ACTIONS = [
  'cafe_created',
  'cafe_activated',
  'cafe_deactivated',
  'cafe_deleted',
  'cafe_password_reset',
  'cafe_updated',
  'auth_login_failed',
  'auth_password_changed',
  'product_deleted',
  'category_deleted',
  'qr_generated',
  'qr_change_requested',
  'qr_change_approved',
  'qr_change_rejected',
];

const CAFE_ACTIONS = [
  'cafe_created',
  'cafe_activated',
  'cafe_deactivated',
  'cafe_deleted',
  'cafe_password_reset',
  'cafe_updated',
  'qr_generated',
  'qr_change_requested',
  'qr_change_approved',
  'qr_change_rejected',
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

function countWhereForActions(where, actions) {
  if (typeof where.action === 'string') {
    return actions.includes(where.action) ? where : null;
  }

  return { ...where, action: { in: actions } };
}

function todayWhere(where, today) {
  const currentGte = where.createdAt?.gte;
  const gte = currentGte && currentGte > today ? currentGte : today;

  return {
    ...where,
    createdAt: {
      ...(where.createdAt || {}),
      gte,
    },
  };
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
  const cafeWhere = countWhereForActions(where, CAFE_ACTIONS);
  const securityWhere = countWhereForActions(where, SECURITY_ACTIONS);
  const deletedWhere = countWhereForActions(where, DELETE_ACTIONS);

  const [logs, total, todayCount, cafeCount, securityCount, deletedCount] = await Promise.all([
    prisma.activityLog.findMany({
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
    }),
    prisma.activityLog.count({ where }),
    prisma.activityLog.count({ where: todayWhere(where, today) }),
    cafeWhere ? prisma.activityLog.count({ where: cafeWhere }) : 0,
    securityWhere ? prisma.activityLog.count({ where: securityWhere }) : 0,
    deletedWhere ? prisma.activityLog.count({ where: deletedWhere }) : 0,
  ]);

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
