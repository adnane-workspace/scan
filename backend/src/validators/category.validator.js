import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid category id');

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    description: z.string().trim().max(300).optional(),
    order: z.number().int().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      name: z.string().trim().min(1).max(80).optional(),
      description: z.string().trim().max(300).optional(),
      order: z.number().int().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
