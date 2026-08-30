import { z } from 'zod';

export const startTrialSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().min(8).max(30),
    cafeName: z.string().trim().min(2).max(120),
    city: z.string().trim().max(80).optional().default(''),
  }),
});
