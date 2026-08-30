import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/token.js';
import { recordActivity } from './activity.service.js';
import { invalidatePublicMenu } from './menuCache.service.js';
import { getPlatformCafe } from './platform.service.js';

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

export function sortCategoriesParentsFirst(categories) {
  const byId = new Map(categories.map((item) => [item.id, item]));

  function depth(category) {
    let current = category;
    let level = 0;

    while (current?.parentId && byId.has(current.parentId) && level < 32) {
      current = byId.get(current.parentId);
      level += 1;
    }

    return level;
  }

  return [...categories].sort((left, right) => depth(left) - depth(right) || left.order - right.order);
}

async function cloneCafeContent(tx, source, targetId) {
  await tx.product.deleteMany({ where: { cafeId: targetId } });
  await tx.category.updateMany({ where: { cafeId: targetId }, data: { parentId: null } });
  await tx.category.deleteMany({ where: { cafeId: targetId } });

  await tx.cafe.update({
    where: { id: targetId },
    data: {
      name: source.name,
      description: source.description,
      logo: source.logo,
      cover: source.cover,
      address: source.address,
      phone: source.phone,
      latitude: source.latitude,
      longitude: source.longitude,
      menuUi: source.menuUi ?? {},
    },
  });

  const categories = await tx.category.findMany({ where: { cafeId: source.id } });
  const idMap = new Map();

  for (const category of sortCategoriesParentsFirst(categories)) {
    const created = await tx.category.create({
      data: {
        cafeId: targetId,
        parentId: category.parentId ? idMap.get(category.parentId) || null : null,
        name: category.name,
        description: category.description,
        image: category.image,
        order: category.order,
      },
    });
    idMap.set(category.id, created.id);
  }

  const products = await tx.product.findMany({ where: { cafeId: source.id } });

  for (const product of products) {
    const categoryId = idMap.get(product.categoryId);

    if (!categoryId) {
      continue;
    }

    await tx.product.create({
      data: {
        cafeId: targetId,
        categoryId,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        available: product.available,
        order: product.order,
      },
    });
  }
}

export async function startTrial({ name, email, phone, cafeName, city = '' }) {
  const playground = await prisma.cafe.findFirst({
    where: { trialRole: 'playground' },
    include: {
      users: {
        where: { role: 'admin' },
        orderBy: { createdAt: 'asc' },
        take: 1,
      },
    },
  });

  const owner = playground?.users?.[0];

  if (!playground || !playground.isActive || !owner) {
    throw new ApiError(503, 'Trial is not configured', null, 'TRIAL_NOT_CONFIGURED');
  }

  const lead = await prisma.trialLead.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      cafeName: cafeName.trim(),
      city: city.trim(),
    },
  });

  await recordActivity({
    action: 'trial_started',
    actorId: owner.id,
    cafeId: playground.id,
    metadata: {
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone,
      leadCafeName: lead.cafeName,
      leadCity: lead.city,
    },
  });

  return {
    token: generateToken({
      sub: owner.id,
      role: owner.role,
      cafeId: owner.cafeId,
    }),
    user: toPublicUser(owner),
  };
}

export async function resetTrialCafe(cafeId, actor) {
  const playground = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: { id: true, name: true, slug: true, trialRole: true },
  });

  if (!playground) {
    throw new ApiError(404, 'Cafe not found', null, 'CAFE_NOT_FOUND');
  }

  if (playground.trialRole !== 'playground') {
    throw new ApiError(400, 'This cafe is not the trial account', null, 'TRIAL_NOT_PLAYGROUND');
  }

  return populateFromTemplate(cafeId, actor);
}

export async function populateFromTemplate(targetId, actor) {
  const target = await prisma.cafe.findUnique({
    where: { id: targetId },
    select: { id: true, name: true, slug: true },
  });

  if (!target) {
    throw new ApiError(404, 'Cafe not found', null, 'CAFE_NOT_FOUND');
  }

  const template = await prisma.cafe.findFirst({
    where: { trialRole: 'template' },
  });

  if (!template) {
    throw new ApiError(400, 'No trial template cafe', null, 'TRIAL_TEMPLATE_MISSING');
  }

  if (template.id === target.id) {
    throw new ApiError(400, 'Template and target cannot be the same cafe', null, 'TRIAL_SAME_CAFE');
  }

  await prisma.$transaction(async (tx) => {
    await cloneCafeContent(tx, template, target.id);
  });

  invalidatePublicMenu(target.id, [target.slug]);

  await recordActivity({
    action: 'trial_reset',
    actorId: actor?.id,
    cafeId: target.id,
    metadata: {
      cafeName: target.name,
      slug: target.slug,
      templateId: template.id,
      templateName: template.name,
      type: 'manual_populate',
    },
  });

  return getPlatformCafe(target.id);
}

export async function listTrialLeads() {
  const leads = await prisma.trialLead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return leads.map((lead) => ({
    _id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    cafeName: lead.cafeName,
    city: lead.city,
    createdAt: lead.createdAt,
  }));
}
