# Decisions Log — Tourism Platform

Catatan keputusan teknis yang sudah disepakati sebelum eksekusi Fase 0. Dokumen ini melengkapi `tourism-platform-blueprint.md` (arsitektur) dan `prd.md` (scope) — bukan menggantikannya. Keputusan di sini adalah resolusi dari poin-poin yang sebelumnya masih menggantung di implementation plan.

Format: ADR ringkas — keputusan, konteks, alternatif yang ditolak, konsekuensi.

Status keputusan: **Disepakati** (semua entri di dokumen ini sudah dikonfirmasi eksplisit oleh user, 30/08/2026).

---

## D1 — ORM: Prisma

**Keputusan:** `services/api` memakai **Prisma** sebagai ORM (task 3.2 tidak lagi "Prisma/TypeORM" — sudah dikunci ke Prisma).

**Konteks:** Keputusan ORM menentukan bentuk skema, workflow migration, dan cara query. Blueprint menyebut PostgreSQL relasional dengan FK antar entity.

**Alternatif yang ditolak:**
- *TypeORM* — lebih fleksibel tapi lebih banyak boilerplate dan gotchas; kelebihannya (query builder kompleks) tidak dibutuhkan di skala pilot.

**Konsekuensi:**
- Migration via `prisma migrate`, schema di `services/api/prisma/schema.prisma`, selaras dengan skema kanonik `packages/core` (task 0.6) — skema kanonik tetap source of truth; Prisma schema adalah proyeksi storage-nya.
- Geospatial tidak pakai fitur khusus ORM — lihat D2.

---

## D2 — Strategi Geospatial: Bounding box dulu, bukan PostGIS

**Keputusan:** Lokasi disimpan sebagai dua kolom `latitude` / `longitude` (Float) + index B-tree biasa. Query "dekat sini" pakai bounding box (`BETWEEN` pada lat/lng), dengan filtering jarak eksak via haversine di aplikasi hanya pada hasil yang sudah terfilter. **Tidak install PostGIS di fase pilot.**

**Konteks:** Task 3.4 sebelumnya "evaluasi PostGIS vs bounding box". Skala pilot: 1 kota, ratusan–ribu record, use case "rekomendasi tempat dalam radius X" — error presisi bounding box (±puluhan meter) tidak mempengaruhi keputusan traveler.

**Aturan yang wajib dijaga sejak migration pertama (syarat supaya upgrade ke PostGIS nanti murah):**
1. Koordinat **wajib** dua kolom terpisah `latitude`/`longitude` — dilarang disimpan sebagai JSON/string gabungan.
2. Skema kanonik `packages/core` merepresentasikan lokasi sebagai interface `{ lat, lng }`.
3. Ada **satu** fungsi terpusat (mis. `findNearby(lat, lng, radiusKm)`) di `packages/core` atau repository layer — semua query geospatial lewat situ. Upgrade ke PostGIS nanti = ganti implementasi di satu tempat.

**Alternatif yang ditunda (bukan ditolak permanen):** PostGIS — relevan saat multi-kota, polygon area, atau routing jalan raya. Konsisten dengan daftar "sengaja tidak masuk blueprint" fase pilot.

---

## D3 — Auth Minimal: JWT via `@nestjs/jwt`, httpOnly cookie, single role

**Keputusan:**
- Auth berada di **`services/api`** (NestJS) — bukan NextAuth di `apps/web` (melanggar boundary frontend-only).
- `POST /auth/login` → JWT, disimpan di **httpOnly cookie** (bukan localStorage, tahan XSS).
- **Single role** saja: `ADMIN`. Tidak ada RBAC, SSO, atau role kompleks di fase pilot.
- **Tidak ada register publik** — user di-seed (seed script / kredensial via `.env`), 1 akun per dinas/kota.
- Tabel user punya kolom `city_scope` sejak awal untuk kebutuhan "scoped per kota/dinas" (task 5.6) — kolom disiapkan sekarang, penegakan filter-nya menyusul.

**Route yang butuh proteksi di fase pilot:** verifikasi Business (1.5), review queue entity resolution (2.3), CRUD admin (3.6), dashboard Government (5.5–5.6).
**Route publik:** planner, listing/discovery, submit self-registration, traveler event logging.

**Konsekuensi:** Effort ±1 hari. Kalau nanti butuh multi-user serius, swap strategi — guard NestJS sudah jadi satu lapisan terpusat, jadi permukaan perubahannya kecil.

---

## D4 — LLM Provider: Gemini (Flash) untuk fase pilot

**Keputusan:** LLM composition (task 4.4) memakai **Gemini Flash**, dengan fitur **structured/JSON output** bawaan untuk itinerary per jam.

**Konteks & alasan:**
1. **Biaya**: free tier Gemini Flash mencakup kebutuhan dev/tuning prompt di fase pilot; OpenAI berbayar sejak awal.
2. **Posisi LLM rendah di arsitektur**: kualitas planner datang dari data & ranking (Fase 1–3) + grounding validation (4.5), bukan dari kecerdasan model. LLM hanya composer naratif — jadi provider dengan biaya termurah yang memenuhi kebutuhan menang.
3. Bahasa Indonesia: kedua provider sama-sama bagus — bukan pembeda.

**Alternatif yang ditolak/ditunda:**
- *OpenAI GPT-4o-mini* — pilihan sah (keputusan ini murah dibalik), tapi tidak ada alasan kuat dibanding Gemini di konteks biaya pilot.
- *Model besar (GPT-4o, Claude Sonnet, dsb.)* — overkill dan boros untuk tugas menyusun hasil retrieval jadi narasi.

**Guard yang wajib ada di `llm-composition.service.ts` (task 4.4):**
- Timeout per call.
- **Budget ceiling**: maksimal N call/hari via config — proteksi dari loop/bug yang membakar quota di tengah pilot.

**Konsekuensi:** Provider dikapsulkan di satu service (`llm-composition.service.ts`); balik ke provider lain cukup ganti service itu, tidak menjalar.

---

## D5 — Validation Library: Zod untuk skema kanonik di `packages/core`

**Keputusan:** Skema kanonik entity (task 0.6) memakai **Zod** — satu definisi skema menghasilkan TypeScript type (inference) + validator runtime.

**Konteks:** Skema kanonik dipakai lintas layer (`core` sebagai source of truth, `web` untuk validasi form, `api` untuk validasi payload). implementation-plan 0.6 semula menyebut "zod atau class-validator".

**Alternatif yang ditolak:**
- *class-validator* — natif NestJS tapi class-based, tidak menghasilkan type otomatis, verbose di sisi frontend.
- *Tanpa library (validator manual)* — nol dependency tapi validasi ditulis tangan dua kali, rawan drift dengan type.

**Konsekuensi:**
- Dependency baru di `packages/core` (disetujui user, 30/08/2026).
- DTO NestJS (task 1.4 dst.) tetap wajib sesuai `agents.md` — DTO bisa dibungkus dari schema Zod via `zod-to-json-schema`/pipe adapter, atau DTO class yang memvalidasi dengan skema; diputuskan saat implementasi task terkait.
- Type entity dilarang didefinisikan manual terpisah dari skema — type harus hasil `z.infer` agar tidak drift.

---

## D6 — Field Trust Metadata: pendekatan sidecar (bukan wrapper nilai)

**Keputusan:** Trust metadata per-field (task 0.7) disimpan sebagai **map terpisah** `fieldTrust: Record<fieldName, { source, trustScore, freshnessTimestamp }>` di sisi entity — nilai field tetap flat.

**Alternatif yang ditolak:**
- *Wrapper nilai* (`{ value, source, trustScore, freshnessTimestamp }` per field) — memaksa semua konsumen membaca `.value`, menyulitkan mapping Prisma (Fase 3), dan merge logic (2.2) jadi rumit.

**Kontrak utama:** record-level `source` tetap ada (pengirim record); `fieldTrust[field].source` meng-override per field; `fieldTrust` boleh kosong saat ingestion, **wajib lengkap** untuk `TRUST_REQUIRED_FIELDS` setelah merge (Fase 2.2); default trustScore per sumber: government 1.0 / business_self_reg 0.7 / traveler 0.5 (di-tune di Fase 6.1).

**Dokumentasi:** `packages/core/docs/trust-metadata.md`.

---

## Status keputusan yang masih terbuka

Tidak ada — semua keputusan pra-Fase 0 yang menggantung sudah diresolusikan di dokumen ini.

