import bcrypt from 'bcrypt';
import { User } from '../../src/models/User.js';
import { createCafe } from '../helpers.js';

describe('User', () => {
  it('creates a valid user', async () => {
    const cafe = await createCafe();
    const passwordHash = await bcrypt.hash('DemoAdmin123!', 10);

    const user = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
      cafeId: cafe._id,
    });

    expect(user.name).toBe('Admin');
    expect(user.email).toBe('admin@example.com');
    expect(user.role).toBe('admin');
    expect(user.cafeId.toString()).toBe(cafe._id.toString());
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('requires an email', async () => {
    const passwordHash = await bcrypt.hash('DemoAdmin123!', 10);

    await expect(
      User.create({
        name: 'Admin',
        passwordHash,
      }),
    ).rejects.toThrow(/Email is required/);
  });

  it('enforces a unique email', async () => {
    const passwordHash = await bcrypt.hash('DemoAdmin123!', 10);

    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
    });

    await expect(
      User.create({
        name: 'Other Admin',
        email: 'ADMIN@example.com',
        passwordHash,
      }),
    ).rejects.toMatchObject({ code: 11000 });
  });

  it('requires passwordHash', async () => {
    await expect(
      User.create({
        name: 'Admin',
        email: 'admin@example.com',
      }),
    ).rejects.toThrow(/passwordHash is required/);
  });

  it('never returns passwordHash by default', async () => {
    const passwordHash = await bcrypt.hash('DemoAdmin123!', 10);

    const created = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
    });

    const found = await User.findById(created._id);
    const json = found.toJSON();

    expect(found.passwordHash).toBeUndefined();
    expect(json.passwordHash).toBeUndefined();
  });
});
