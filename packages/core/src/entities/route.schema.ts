import { z } from 'zod';

export const routeStopEntityTypeSchema = z.enum(['destination', 'business', 'umkm']);
export type RouteStopEntityType = z.infer<typeof routeStopEntityTypeSchema>;

export const routeStopSchema = z.object({
  entityType: routeStopEntityTypeSchema,
  entityId: z.string().min(1),
  durationMinutes: z.number().int().positive().optional(),
  order: z.number().int().nonnegative(),
});
export type RouteStop = z.infer<typeof routeStopSchema>;

// Route TIDAK extends baseEntitySchema — ini komposisi perjalanan (runtutan stop),
// bukan tempat fisik. Location/hours/price tidak relevan di level route.
export const routeSchema = z.object({
  id: z.string().min(1),
  stops: z.array(routeStopSchema).min(1),
  totalEstimatedMinutes: z.number().int().positive().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Route = z.infer<typeof routeSchema>;
