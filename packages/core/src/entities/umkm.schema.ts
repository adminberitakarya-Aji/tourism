import { z } from 'zod';
import { baseEntitySchema } from './base.schema';

export const umkmCategorySchema = z.enum([
  'craft',
  'food',
  'fashion',
  'agro',
  'service',
  'other',
]);
export type UmkmCategory = z.infer<typeof umkmCategorySchema>;

export const umkmSchema = baseEntitySchema.extend({
  products: z.array(z.string().min(1)).min(1),
  category: umkmCategorySchema,
});
export type Umkm = z.infer<typeof umkmSchema>;
