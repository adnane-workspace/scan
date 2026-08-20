import { Cafe } from '../../src/models/Cafe.js';

describe('Cafe', () => {
  it('creates a valid cafe', async () => {
    const cafe = await Cafe.create({
      name: 'Café Central',
      slug: 'cafe-central',
      description: 'Cafe de demonstration',
      address: '12 Rue de la Paix',
      phone: '+33 1 23 45 67 89',
    });

    expect(cafe.name).toBe('Café Central');
    expect(cafe.slug).toBe('cafe-central');
    expect(cafe.isActive).toBe(true);
    expect(cafe.createdAt).toBeInstanceOf(Date);
  });

  it('requires a slug', async () => {
    await expect(
      Cafe.create({
        name: 'Café Central',
      }),
    ).rejects.toThrow(/Slug is required/);
  });

  it('enforces a unique slug', async () => {
    await Cafe.create({
      name: 'Café Central',
      slug: 'cafe-central',
    });

    await expect(
      Cafe.create({
        name: 'Autre Café',
        slug: 'Cafe-Central',
      }),
    ).rejects.toMatchObject({ code: 11000 });
  });
});
