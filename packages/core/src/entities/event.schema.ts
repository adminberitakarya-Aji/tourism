import { z } from 'zod';
import { baseEntitySchema } from './base.schema';

export const eventSchema = baseEntitySchema.extend({
  title: z.string().min(1),
  startsAt: z.date(),
  endsAt: z.date(),
  venue: z.string().optional(),
  destinationId: z.string().optional(),
  isRecurring: z.boolean(),
});
export type Event = z.infer<typeof eventSchema>;
