import { z } from 'zod';
import { uuidSchema } from './id.schema.js';
import { paginationFields } from './pagination.schema.js';

const objectIdSchema = uuidSchema;

const imageSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === '' || /^https?:\/\//i.test(value), 'Invalid image URL');

const parentIdSchema = z.preprocess(
  (value) => (value === '' || value === undefined ? null : value),
  uuidSchema.nullable(),
);

const sectionKeySchema = z.preprocess(
  (value) => (value === '' || value === undefined ? null : value),
  z
    .string()
    .trim()
    .toLowerCase()
    .max(40)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid section key')
    .nullable(),
);

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    description: z.string().trim().max(300).optional(),
    order: z.number().int().optional(),
    image: imageSchema.optional(),
    parentId: parentIdSchema.optional(),
    sectionKey: sectionKeySchema.optional(),
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
      parentId: parentIdSchema.optional(),
      sectionKey: sectionKeySchema.optional(),
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

export const listCategoriesSchema = z.object({
  query: z.object({
    ...paginationFields,
  }),
});
