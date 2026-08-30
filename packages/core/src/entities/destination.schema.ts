import { z } from 'zod';
import { baseEntitySchema } from './base.schema';

export const destinationCategorySchema = z.enum([
  'nature',
  'beach',
  'cultural',
  'historical',
  'adventure',
  'culinary_area',
  'other',
]);
export type DestinationCategory = z.infer<typeof destinationCategorySchema>;

export const destinationSchema = baseEntitySchema.extend({
  category: destinationCategorySchema,
  ticketPrice: z.number().nonnegative().optional(),
  recommendedDurationMinutes: z.number().int().positive().optional(),
});
export type Destination = z.infer<typeof destinationSchema>;
