import { z } from 'zod';
import { uuidSchema } from './id.schema.js';

export const createQrChangeRequestSchema = z.object({
  body: z.object({
    reason: z.string().trim().min(8).max(400),
  }),
});

export const listQrChangeRequestsSchema = z.object({
  query: z.object({
    status: z.enum(['pending', 'approved', 'rejected', 'all']).optional(),
  }),
});

export const reviewQrChangeRequestSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    decision: z.enum(['approved', 'rejected']),
    note: z.string().trim().max(400).optional(),
  }),
});
