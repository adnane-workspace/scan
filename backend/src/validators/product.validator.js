import { z } from 'zod';
import { uuidSchema } from './id.schema.js';

const objectIdSchema = uuidSchema;

const imageSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === '' || /^https?:\/\//i.test(value), 'Invalid image URL');

const productBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  price: z.number().min(0),
  image: imageSchema.optional(),
  available: z.boolean().optional(),
  order: z.number().int().optional(),
  categoryId: objectIdSchema,
});

export const createProductSchema = z.object({
  body: productBodySchema,
});

export const updateProductSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      name: z.string().trim().min(1).max(120).optional(),
      description: z.string().trim().max(500).optional(),
      price: z.number().min(0).optional(),
      image: imageSchema.optional(),
      available: z.boolean().optional(),
      order: z.number().int().optional(),
      categoryId: objectIdSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
