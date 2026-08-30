# Trust Metadata Contract — packages/core

Dokumentasi kontrak **field trust metadata** (task Fase 0.7). Source of truth implementasinya: `src/trust/field-trust.schema.ts`. Spesifikasi deteksi duplikat (0.8) dan write-authority matrix (0.9) menyusul di folder `docs/` ini.

## Pendekatan: metadata sidecar

Nilai field **tetap flat** di entity. Metadata trust disimpan di map terpisah berkunci nama field:

```ts
{
  id: "d1",
  name: "Pantai A",
  priceInfo: { currency: "IDR", min: 10000, unit: "per_person" },
  // ...field lain...
  source: "government",            // record-level: siapa pengirim record
  fieldTrust: {                    // per-field: siapa yang mengisi field ini
    name:        { source: "government",        trustScore: 1.0, freshnessTimestamp: ... },
    priceInfo:   { source: "business_self_reg", trustScore: 0.7, freshnessTimestamp: ... },
  }
}
```

Alasan sidecar (bukan wrapper nilai): konsumen tetap baca field normal (`entity.priceInfo`, bukan `entity.priceInfo.value`), mapping ke database (Fase 3) sederhana, dan merge logic (Fase 2.2) membandingkan per key field secara langsung.

## Skema

- `FieldTrust = { source: RecordSource; trustScore: number (0..1); freshnessTimestamp: Date }`
- `FieldTrustMap = Record<fieldName, FieldTrust>`

## Aturan kontrak

1. **Record-level `source` tetap ada** — "siapa pengirim record". `fieldTrust[field].source` meng-override per field.
2. **Ingestion**: `fieldTrust` boleh belum lengkap saat record baru masuk.
3. **Merge (Fase 2.2)**: setelah merge, semua field di `TRUST_REQUIRED_FIELDS` **wajib** punya entri — di-enforce di merge logic, bukan saat parse.
4. **trustScore default per sumber** (`DEFAULT_TRUST_SCORE_BY_SOURCE`): government = 1.0, business_self_reg = 0.7, traveler = 0.5. Nilai ini akan di-tune oleh feedback loop (Fase 6.1).
5. **Field wajib trust** per entity (`TRUST_REQUIRED_FIELDS`):
   - semua entity: `name`, `location`, `address`, `priceInfo`, `operatingHours`
   - `destination`: + `category`
   - `business`: + `businessType`
   - `umkm`: + `category`, `products`
   - `event`: hanya field dasar
   - `route`: tidak ada (trust melekat pada entity per stop)

## Helper

- `withFieldTrust(entity, map)` — set metadata, immutable.
- `getFieldTrust(entity, fieldName)` — baca trust satu field; fallback ke record-level `source` + default score sumber itu; return `null` kalau entity tak punya sumber (mis. `Route`).

## Yang sengaja TIDAK di fase ini

- Decay otomatis freshness (listing basi) — di-tune saat Fase 6.
- Riwayat trust per field (audit trail penuh) — cukup `updatedAt`/`updatedBySource` record-level dulu (3.5).
