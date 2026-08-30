import { z } from 'zod';

// ---------- Primitives bersama ----------

export const dayOfWeekSchema = z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>;

const hhmmRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const operatingHourSchema = z.object({
  day: dayOfWeekSchema,
  open: z.string().regex(hhmmRegex).optional(),
  close: z.string().regex(hhmmRegex).optional(),
  closed: z.boolean(),
});
export type OperatingHour = z.infer<typeof operatingHourSchema>;

// Sesuai decisions.md D2: koordinat WAJIB dua angka terpisah (lat/lng), bukan string gabungan.
export const geoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type GeoPoint = z.infer<typeof geoPointSchema>;

export const contactSchema = z.object({
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().url().optional(),
});
export type Contact = z.infer<typeof contactSchema>;

export const priceUnitSchema = z.enum(['per_person', 'per_group', 'per_item', 'free']);
export type PriceUnit = z.infer<typeof priceUnitSchema>;

export const priceInfoSchema = z.object({
  currency: z.literal('IDR'),
  min: z.number().nonnegative().optional(),
  max: z.number().nonnegative().optional(),
  unit: priceUnitSchema,
});
export type PriceInfo = z.infer<typeof priceInfoSchema>;

export const recordSourceSchema = z.enum(['government', 'business_self_reg', 'traveler']);
export type RecordSource = z.infer<typeof recordSourceSchema>;

export const recordStatusSchema = z.enum(['active', 'pending_review', 'rejected', 'inactive']);
export type RecordStatus = z.infer<typeof recordStatusSchema>;

// ---------- Base entity ----------

// Catatan 0.7: field trust metadata per-field (trust_score, freshness_timestamp)
// akan ditambahkan di layer di atas base ini — jangan duplikasi di sini.
export const baseEntitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  location: geoPointSchema,
  address: z.string().min(1),
  city: z.string().min(1),
  photos: z.array(z.string().url()).optional(),
  contact: contactSchema.optional(),
  operatingHours: z.array(operatingHourSchema).optional(),
  priceInfo: priceInfoSchema.optional(),
  source: recordSourceSchema,
  status: recordStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  updatedBySource: recordSourceSchema,
});
export type BaseEntity = z.infer<typeof baseEntitySchema>;
