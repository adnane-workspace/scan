import { prisma } from '../../src/config/prisma.js';
import { deletePlatformCafe } from '../../src/services/platform.service.js';
import { createCafe, createCategory, createUser } from '../helpers.js';

describe('deletePlatformCafe', () => {
  it('removes the cafe, nested menu, manager account and logs the action', async () => {
    const cafe = await createCafe({ name: 'Café à supprimer', slug: 'cafe-to-delete' });
    const owner = await createUser({
      cafeId: cafe.id,
      email: 'owner-to-delete@example.com',
      name: 'Owner',
    });
    const actor = await createUser({
      cafeId: null,
      email: 'super-delete@example.com',
      role: 'superadmin',
      name: 'Super',
    });
    const parent = await createCategory({ cafeId: cafe.id, name: 'Boissons' });
    const child = await prisma.category.create({
      data: {
        cafeId: cafe.id,
        parentId: parent.id,
        name: 'Cafés',
        order: 2,
      },
    });
    await prisma.product.create({
      data: {
        cafeId: cafe.id,
        categoryId: child.id,
        name: 'Espresso',
        price: 2.5,
      },
    });
    await prisma.qrChangeRequest.create({
      data: {
        cafeId: cafe.id,
        requesterId: owner.id,
        reason: 'QR perdu',
      },
    });

    const result = await deletePlatformCafe(cafe.id, { id: actor.id });

    expect(result).toEqual({
      _id: cafe.id,
      name: 'Café à supprimer',
      slug: 'cafe-to-delete',
    });

    await expect(prisma.cafe.findUnique({ where: { id: cafe.id } })).resolves.toBeNull();
    await expect(prisma.user.findUnique({ where: { id: owner.id } })).resolves.toBeNull();
    await expect(prisma.user.findUnique({ where: { id: actor.id } })).resolves.not.toBeNull();
    await expect(prisma.category.count({ where: { cafeId: cafe.id } })).resolves.toBe(0);
    await expect(prisma.product.count({ where: { cafeId: cafe.id } })).resolves.toBe(0);
    await expect(prisma.qrChangeRequest.count({ where: { cafeId: cafe.id } })).resolves.toBe(0);

    const log = await prisma.activityLog.findFirst({
      where: { action: 'cafe_deleted' },
      orderBy: { createdAt: 'desc' },
    });

    expect(log).toMatchObject({
      actorId: actor.id,
      cafeId: null,
    });
    expect(log.metadata).toMatchObject({
      cafeName: 'Café à supprimer',
      slug: 'cafe-to-delete',
      ownerEmail: 'owner-to-delete@example.com',
    });
  });

  it('rejects an unknown cafe', async () => {
    await expect(deletePlatformCafe('11111111-1111-1111-1111-111111111111', { id: 'actor' })).rejects.toMatchObject({
      statusCode: 404,
      code: 'CAFE_NOT_FOUND',
    });
  });
});
