import { z } from 'zod';
import { publicMenuSlugSchema } from './menu.validator.js';

const optionalId = z.preprocess((value) => {
  const text = String(value || '').trim();
  return text || undefined;
}, z.string().uuid().optional());

export const sharePreviewSchema = publicMenuSlugSchema.extend({
  query: z.object({
    category: optionalId,
    product: optionalId,
  }),
});
