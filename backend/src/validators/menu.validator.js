import { z } from 'zod';

export const publicMenuSlugSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid menu slug'),
  }),
});
