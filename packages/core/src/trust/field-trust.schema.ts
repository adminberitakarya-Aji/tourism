import { z } from 'zod';
import { recordSourceSchema, RecordSource } from '../entities/base.schema';

// ---------- Skema ----------

// Metadata trust UNTUK SATU FIELD. Pendekatan sidecar (D6): nilai field tetap flat
// di entity, metadata trust disimpan di map terpisah berkunci nama field.
export const fieldTrustSchema = z.object({
  source: recordSourceSchema,
  trustScore: z.number().min(0).max(1),
  freshnessTimestamp: z.date(),
});
export type FieldTrust = z.infer<typeof fieldTrustSchema>;

export const fieldTrustMapSchema = z.record(z.string(), fieldTrustSchema);
export type FieldTrustMap = z.infer<typeof fieldTrustMapSchema>;

// ---------- Kontrak ----------

// trustScore awal per jenis sumber — nilai default, di-tune di Fase 6.1 (feedback loop).
export const DEFAULT_TRUST_SCORE_BY_SOURCE: Readonly<Record<RecordSource, number>> = {
  government: 1.0,
  business_self_reg: 0.7,
  traveler: 0.5,
};

// Field yang WAJIB punya entri di fieldTrust setelah merge (Fase 2.2).
// Saat record baru masuk (ingestion), fieldTrust boleh belum lengkap.
const TRUST_REQUIRED_BASE_FIELDS = ['name', 'location', 'address', 'priceInfo', 'operatingHours'] as const;

export const TRUST_REQUIRED_FIELDS: Readonly<
  Record<'destination' | 'business' | 'umkm' | 'event', readonly string[]> & {
    route: readonly [];
  }
> = {
  destination: [...TRUST_REQUIRED_BASE_FIELDS, 'category'],
  business: [...TRUST_REQUIRED_BASE_FIELDS, 'businessType'],
  umkm: [...TRUST_REQUIRED_BASE_FIELDS, 'category', 'products'],
  event: [...TRUST_REQUIRED_BASE_FIELDS],
  // Route adalah komposisi perjalanan — trust melekat pada entity per stop, bukan di route.
  route: [],
};

export type EntityWithFieldTrust<T> = T & { fieldTrust: FieldTrustMap };

// ---------- Helper ----------

/** Set metadata trust di atas entity (immutable — mengembalikan objek baru). */
export function withFieldTrust<T extends object>(entity: T, map: FieldTrustMap): EntityWithFieldTrust<T> {
  return { ...entity, fieldTrust: map };
}

/**
 * Baca trust metadata satu field.
 * Fallback: kalau field tidak ada di map, pakai record-level `source` dengan
 * default trust score sumber itu, dan `updatedAt` sebagai freshness.
 * Return null kalau entity tidak punya sumber apa pun (mis. Route).
 */
export function getFieldTrust(
  entity: { fieldTrust?: FieldTrustMap; source?: RecordSource; updatedAt?: Date },
  fieldName: string,
): FieldTrust | null {
  const explicit = entity.fieldTrust?.[fieldName];
  if (explicit) return explicit;
  if (!entity.source) return null;
  return {
    source: entity.source,
    trustScore: DEFAULT_TRUST_SCORE_BY_SOURCE[entity.source],
    freshnessTimestamp: entity.updatedAt ?? new Date(0),
  };
}
