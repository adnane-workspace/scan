import bcrypt from 'bcrypt';
import { Cafe } from '../src/models/Cafe.js';
import { Category } from '../src/models/Category.js';
import { User } from '../src/models/User.js';

export async function createCafe(overrides = {}) {
  return Cafe.create({
    name: 'Café Central',
    slug: `cafe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...overrides,
  });
}

export async function createUser(overrides = {}) {
  const cafe = overrides.cafeId ? null : await createCafe();
  const passwordHash = overrides.passwordHash ?? (await bcrypt.hash('DemoAdmin123!', 10));

  return User.create({
    name: 'Admin',
    email: `admin-${Date.now()}@example.com`,
    passwordHash,
    role: 'admin',
    cafeId: cafe?._id ?? null,
    ...overrides,
  });
}

export async function createCategory(overrides = {}) {
  const cafeId = overrides.cafeId ?? (await createCafe())._id;

  return Category.create({
    cafeId,
    name: 'Cafés',
    order: 1,
    ...overrides,
  });
}
