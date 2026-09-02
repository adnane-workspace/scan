import { z } from 'zod';

export const paginationFields = {
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
};

export const paginationQuerySchema = z.object(paginationFields);

export const listStorageSchema = z.object({
  query: z.object({
    ...paginationFields,
    refresh: z.string().optional(),
  }),
});
