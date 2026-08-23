import { z } from 'zod';
import { uuidSchema } from './id.schema.js';

export const updateCafeSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      slug: z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug')
        .max(80)
        .optional(),
      description: z.string().trim().max(500).optional(),
      logo: z.string().trim().max(500).optional(),
      address: z.string().trim().max(200).optional(),
      phone: z.string().trim().max(30).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: 'At least one field is required',
    }),
});

export const createPlatformCafeSchema = z.object({
  body: z.object({
    ownerName: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(120),
    cafeName: z.string().trim().min(2).max(120),
    slug: z.preprocess(
      (value) => (value === '' || value === undefined || value === null ? undefined : value),
      z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug')
        .max(80)
        .optional(),
    ),
  }),
});

export const platformCafeIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

export const resetPlatformCafePasswordSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    password: z.string().min(8).max(120),
  }),
});

export const updatePlatformCafeSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});
