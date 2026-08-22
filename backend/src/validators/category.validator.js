import { z } from 'zod';
import { uuidSchema } from './id.schema.js';

const objectIdSchema = uuidSchema;

const imageSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === '' || /^https?:\/\//i.test(value), 'Invalid image URL');

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    description: z.string().trim().max(300).optional(),
    order: z.number().int().optional(),
    image: imageSchema.optional(),
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
      image: imageSchema.optional(),
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
