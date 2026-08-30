import { z } from 'zod';
import { baseEntitySchema } from './base.schema';

export const businessTypeSchema = z.enum([
  'hotel',
  'restaurant',
  'guide',
  'transport',
  'souvenir',
  'other',
]);
export type BusinessType = z.infer<typeof businessTypeSchema>;

export const priceRangeSchema = z.enum(['cheap', 'moderate', 'premium']);
export type PriceRange = z.infer<typeof priceRangeSchema>;

export const businessSchema = baseEntitySchema.extend({
  businessType: businessTypeSchema,
  destinationId: z.string().optional(),
  priceRange: priceRangeSchema.optional(),
});
export type Business = z.infer<typeof businessSchema>;
