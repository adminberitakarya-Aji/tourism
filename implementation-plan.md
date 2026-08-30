# Implementation Plan — Tourism Platform (Fase Pilot)

Stack: **Next.js** (`apps/web`) · **NestJS** (`services/api`) · **PostgreSQL** · **pnpm workspaces**

Status tiap task cuma diubah jadi **Done** setelah dikonfirmasi eksplisit (file ada di repo, test/acceptance criteria terpenuhi) — bukan otomatis karena "kelihatannya selesai".

Legend status: `Not Started` / `In Progress` / `Done`

---

## FASE 0 — Foundation, Kontrak Data & Struktur Folder

| # | Task | Deliverable / Acceptance Criteria | Depends on | Status |
|---|---|---|---|---|
| 0.1 | Setup root monorepo | `package.json` root, `pnpm-workspace.yaml` (`apps/*`, `packages/*`, `services/*`), `.gitignore`, base `tsconfig.json` | — | Done ✅ 30/08/2026 |
| 0.2 | Scaffold `apps/web` | Next.js + TypeScript init, jalan di `pnpm dev`, halaman default render | 0.1 | Done ✅ 30/08/2026 |
| 0.3 | Scaffold `services/api` | NestJS + TypeScript init, jalan di `pnpm start:dev`, endpoint health-check (`GET /health`) return 200 | 0.1 | Done ✅ 30/08/2026 |
| 0.4 | Scaffold `packages/core` | Package kosong dengan `index.ts`, ter-resolve sebagai dependency dari `apps/web` & `services/api` via workspace | 0.1 | Done ✅ 30/08/2026 |
| 0.5 | Scaffold `packages/api-client` | Package kosong dengan `index.ts`, ter-resolve sebagai dependency dari `apps/web` | 0.1 | Done ✅ 30/08/2026 |
| 0.6 | Definisi skema kanonik per entity | TypeScript types + validation schema (`zod` atau `class-validator` DTO) untuk `Destination`, `Business`, `UMKM`, `Event`, `Route` di `packages/core` | 0.4 | Done ✅ 30/08/2026 |
| 0.7 | Field trust metadata | Tiap entity punya field `source`, `trust_score`, `freshness_timestamp` per field (bukan cuma per record) — didokumentasikan + di-type | 0.6 | Not Started |
| 0.8 | Entity resolution key spec | Dokumen (bisa markdown di `packages/core/docs/`): kombinasi field per entity type buat deteksi duplikat (nama+lokasi+kategori) | 0.6 | Not Started |
| 0.9 | Field write-authority matrix | Dokumen: field mana boleh ditulis/di-override oleh sumber mana (Government/Business/Traveler), prioritas saat konflik | 0.6 | Not Started |
| 0.10 | End-to-end wiring test | Satu fungsi dummy di `packages/core` (mis. `ping()`) dipanggil dari `apps/web` lewat `packages/api-client` → `services/api` → return sukses. Ini bukti alur nyambung sebelum diisi logic asli | 0.2, 0.3, 0.4, 0.5 | Not Started |

---

## FASE 1 — Ingestion Layer

| # | Task | Deliverable / Acceptance Criteria | Depends on | Status |
|---|---|---|---|---|
| 1.1 | Format import kanonik | Spesifikasi JSON/CSV target format per entity, selaras dengan skema Fase 0.6 | 0.6 | Not Started |
| 1.2 | Government feed adapter | Service di `services/api` yang parse file CSV/Excel → map ke skema kanonik, hasilkan laporan error per baris yang gagal | 1.1 | Not Started |
| 1.3 | Business self-registration — form | Halaman form di `apps/web` (nama usaha, kategori, lokasi, harga, jam operasional, kontak) | 0.6 | Not Started |
| 1.4 | Business self-registration — endpoint | `POST` endpoint di `services/api`, validasi DTO, simpan dengan status `pending_review` | 1.3, 0.6 | Not Started |
| 1.5 | Antrian verifikasi Business | Endpoint/list sederhana untuk lihat entri `pending_review`, aksi approve/reject (bisa API-only dulu, belum perlu UI admin penuh) | 1.4 | Not Started |
| 1.6 | Traveler event logging | Endpoint append-only untuk event (`search`, `click`, `contact_click`, `rating`, `report_error`) — tabel log sederhana, belum perlu stream processing | 0.6 | Not Started |
| 1.7 | Test ingestion end-to-end | 1 file dummy Government + 1 submisi Business dummy → berhasil masuk sebagai record berformat kanonik tanpa perbaikan manual | 1.2, 1.4 | Not Started |

---

## FASE 2 — Normalization & Entity Resolution

| # | Task | Deliverable / Acceptance Criteria | Depends on | Status |
|---|---|---|---|---|
| 2.1 | Fuzzy matching function | Fungsi di `packages/core`: input 2 record, output confidence score match berdasarkan nama (normalized) + jarak lokasi + kategori | 0.8 | Not Started |
| 2.2 | Merge/conflict resolution logic | Fungsi di `packages/core`: 2 record match → 1 record final, field yang menang sesuai `trust_score`/`freshness_timestamp` (0.7, 0.9) | 2.1, 0.7, 0.9 | Not Started |
| 2.3 | Manual review queue | Endpoint list record dengan confidence match rendah (ambigu), aksi manual confirm/reject merge | 2.1 | Not Started |
| 2.4 | Test dedup | Dataset dummy: entitas sama muncul dari Government feed & Business self-reg → berhasil merge jadi 1 record dengan field yang benar menang | 2.1, 2.2 | Not Started |

---

## FASE 3 — Core Data Store

| # | Task | Deliverable / Acceptance Criteria | Depends on | Status |
|---|---|---|---|---|
| 3.1 | Setup PostgreSQL (dev) | Instance lokal/dev jalan, connection string di `services/api` config | — | Not Started |
| 3.2 | Skema database (ORM) | Prisma/TypeORM schema sesuai entity Fase 0.6, relasi FK antar entity (Destination ↔ Business/UMKM/Event/Route) | 0.6, 3.1 | Not Started |
| 3.3 | Migration | Migration script jalan tanpa error, tabel ter-generate sesuai skema | 3.2 | Not Started |
| 3.4 | Index performa | Index untuk lokasi (geospatial — evaluasi PostGIS vs bounding box sederhana), kategori, price range, jam operasional | 3.3 | Not Started |
| 3.5 | Audit/versioning field | Field `updated_at`, `updated_by_source` per record (minimal), idealnya per field jika kompleksitas masih terkendali | 3.2 | Not Started |
| 3.6 | CRUD endpoints per entity | NestJS controller/service per entity type, basic Create/Read/Update (Delete belum prioritas) | 3.2 | Not Started |
| 3.7 | Test query kombinasi filter | Query kategori + lokasi + harga mengembalikan hasil benar dalam waktu wajar (dataset sample ~100-500 record) | 3.4, 3.6 | Not Started |

---

## FASE 4 — AI Engine

*Bisa mulai paralel dengan Fase 1-3 memakai data dummy manual (lihat catatan urutan eksekusi di blueprint), supaya validasi produk gak menunggu pipeline data selesai total.*

| # | Task | Deliverable / Acceptance Criteria | Depends on | Status |
|---|---|---|---|---|
| 4.1 | Retrieval module | Fungsi query Core Data Store berdasarkan constraint keras (budget, durasi, jarak, kategori) — bisa jalan dengan data dummy dulu | 0.6 (atau 3.6 kalau nunggu data store asli) | Not Started |
| 4.2 | Ranking module | Fungsi urutkan hasil retrieval — default rating/popularity, hook untuk personalisasi (diisi nanti di Fase 6) | 4.1 | Not Started |
| 4.3 | Prompt template LLM | Prompt eksplisit: LLM hanya boleh pakai fakta dari data yang di-pass, dilarang menambah nama/harga/jam dari luar data | 4.1, 4.2 | Not Started |
| 4.4 | LLM composition service | Service di `services/api` yang panggil LLM API, input hasil retrieval+ranking, output itinerary terstruktur per jam | 4.3 | Not Started |
| 4.5 | Grounding validation layer | Post-processing check: tiap fakta di output itinerary bisa ditelusuri balik ke record data — reject/flag kalau ada fakta di luar data | 4.4 | Not Started |
| 4.6 | Test AI Engine end-to-end | Input preferensi dummy → itinerary valid tanpa fakta yang dikarang | 4.5 | Not Started |

---

## FASE 5 — Output Layer

| # | Task | Deliverable / Acceptance Criteria | Depends on | Status |
|---|---|---|---|---|
| 5.1 | UI input preferensi traveler | Form di `apps/web`: durasi, budget, jumlah orang, kategori minat | 0.2 | Not Started |
| 5.2 | UI itinerary display | Tampilan itinerary per jam + detail tiap stop (foto, harga, jam buka, cara ke sana) | 4.6, 5.1 | Not Started |
| 5.3 | UI Discovery/listing page | Halaman per entity, SSR (Next.js) untuk SEO | 3.6 | Not Started |
| 5.4 | CTA "hubungi Business" | Tombol WA/telepon di listing/itinerary, klik tercatat sebagai event (Fase 1.6) | 5.2, 5.3, 1.6 | Not Started |
| 5.5 | Government dashboard UI (read-only) | Ringkasan jumlah entity per kategori, tren destinasi/kategori populer dari agregasi event | 3.6, 1.6 | Not Started |
| 5.6 | Auth dashboard Government | Login scoped per kota/dinas — auth sederhana cukup di fase ini (belum perlu SSO/role kompleks) | 5.5 | Not Started |

---

## FASE 6 — Feedback Loop

| # | Task | Deliverable / Acceptance Criteria | Depends on | Status |
|---|---|---|---|---|
| 6.1 | Wire traveler signal → trust_score | Event rating/report-error mempengaruhi `trust_score` field terkait (Fase 0.7) | 1.6, 0.7 | Not Started |
| 6.2 | Wire signal → ranking model | Aggregated signal (klik, kontak, rating) jadi input tambahan di Ranking module (Fase 4.2) | 6.1, 4.2 | Not Started |
| 6.3 | Wire signal → Government dashboard | Dashboard (Fase 5.5) menampilkan tren berbasis data agregat yang sudah termasuk sinyal terbaru | 6.1, 5.5 | Not Started |
| 6.4 | Test feedback loop | Simulasi beberapa interaksi traveler dummy → `trust_score` dan angka dashboard ter-update sesuai ekspektasi | 6.1, 6.2, 6.3 | Not Started |

---

## Catatan eksekusi

- Fase 0 harus selesai penuh sebelum fase lain mulai — ini fondasi kontrak data yang dipakai semua fase berikutnya.
- Fase 4 (AI Engine) boleh dikerjakan paralel dengan Fase 1-3 memakai data dummy, lalu di-swap ke Core Data Store asli begitu Fase 3 selesai — tidak perlu menunggu total.
- Fase 5.5 (Government dashboard) baru bermakna diisi data setelah ada traffic traveler nyata dari Fase 5.1-5.4 — urutan pengerjaan boleh duluan scaffolding-nya, tapi validasi isinya menunggu data nyata.
- Task ditandai Done hanya setelah file ada di repo dan acceptance criteria di atas terverifikasi — bukan asumsi "sudah pasti jalan".
