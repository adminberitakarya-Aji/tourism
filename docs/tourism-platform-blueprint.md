# Blueprint Realisasi — Tourism Platform Data Architecture

Dokumen ini menerjemahkan baseline arsitektur (Data Sources → Ingestion → Normalization → Core Data Store → AI Engine → Output + Feedback Loop) menjadi rencana kerja bertahap. Setiap fase punya deliverable konkret dan bisa dipecah lebih lanjut jadi task per file saat eksekusi.

---

## Prinsip kerja

- **Skeleton/spesifikasi dulu, baru implementasi** — tiap fase di bawah ini dimulai dari desain skema/kontrak data, bukan langsung nulis kode.
- **Lean di fase awal** — untuk 1 kota pilot, jangan bangun infra yang baru dibutuhkan saat sudah multi-kota (queue system besar, graph DB, microservices penuh). Monolith terstruktur cukup.
- **Setiap fase punya definisi "selesai" yang bisa diverifikasi**, bukan cuma "kelihatannya jalan".

---

## FASE 0 — Foundation & Kontrak Data

**Tujuan:** menetapkan skema kanonik sebelum ada satu baris data pun masuk. Ini fondasi semua fase berikutnya — kalau ini berubah belakangan, semua adapter & AI layer ikut kena rework.

**Deliverable:**
1. Skema kanonik per entity type: `Destination`, `Business` (hotel/resto/guide/transport), `UMKM`, `Event`, `Route`.
   - Tiap field punya: nama, tipe, wajib/opsional, dan **field trust metadata** (`source`, `trust_score`, `freshness_timestamp`).
2. Definisi entity resolution key — kombinasi field apa yang dipakai buat deteksi duplikat (mis. nama dinormalisasi + koordinat radius + kategori).
3. Kontrak "siapa boleh menulis field apa" — mis. `harga` bisa di-override oleh Business self-reg, tapi `nama_resmi` prioritas dari Government feed.

**Kenapa didahulukan:** ini yang mencegah masalah "data basi tanpa mekanisme freshness" dan "Business jadi pillar menggantung" yang sempat kita bahas — dua-duanya diselesaikan di level kontrak, bukan di level kode belakangan.

### Struktur Folder & Strategi Web → PWA → Native App

Keputusan produk: mulai dari **web app**, evolusi ke **PWA**, lalu ke **native app** — tapi pondasinya harus disiapkan dari awal supaya tiap naik tahap gak butuh rewrite. Prinsip kuncinya: **business logic & backend API dipisah dari UI**, karena yang berubah antar tahap cuma layer UI-nya.

```
tourism-platform/                    (monorepo)
│
├── apps/
│   └── web/                         ← TAHAP 1: web app biasa
│       (TAHAP 2 PWA: + manifest.json, service worker → nambah file
│        di sini, tanpa restrukturisasi)
│
│   └── mobile/                      ← TAHAP 3: native app
│       (dibuat belakangan, React Native/Flutter — UI baru, tapi
│        konsumsi API & logic yang sama dari packages/)
│
├── packages/
│   ├── core/                        ← business logic murni, framework-agnostic
│   │   (validation rules, itinerary/AI Engine logic, type/schema
│   │    definitions, trust_score & entity resolution rules)
│   │
│   ├── api-client/                  ← satu lapisan fetch/API call
│   │   (dipakai web sekarang, dipakai mobile nanti — tanpa ditulis ulang)
│   │
│   └── ui/                          ← (opsional, isi belakangan)
│       shared design tokens/components untuk konsistensi visual
│       web ↔ mobile
│
└── services/
    └── api/                         ← backend (REST/GraphQL)
        satu-satunya sumber data — dipakai web, PWA, DAN native,
        tanpa backend kedua
```

**Aturan yang harus dijaga sejak commit pertama:**

1. `packages/core` menyimpan logic AI Engine (retrieval/ranking), skema data, dan validasi — tidak boleh bergantung ke Next.js/React. Ini yang dipakai ulang saat native app dibangun nanti.
2. `packages/api-client` adalah satu-satunya kontrak buat manggil backend. Web pakai ini sekarang; mobile pakai fungsi yang sama persis nanti — perubahan endpoint cukup di satu tempat.
3. `services/api` **wajib terpisah** dari `apps/web` — backend tidak boleh ditulis nempel di dalam Next.js API routes. `apps/web` posisinya sama seperti `apps/mobile` nanti: sama-sama konsumen API, bukan pemilik logic.
4. PWA (Tahap 2) murni menambah file (`manifest.json`, `service-worker.js`) di `apps/web` — tidak menyentuh `packages/core` atau `services/api`.

**Definisi selesai:** skeleton monorepo di atas dibuat kosong (folder + package.json per workspace), dan satu fungsi dummy di `packages/core` berhasil dipanggil dari `apps/web` lewat `packages/api-client` → `services/api`, membuktikan alurnya nyambung sebelum diisi logic sungguhan.

---

## FASE 1 — Ingestion Layer

**Tujuan:** tiap sumber data (Government feed, Business self-reg, Traveler signals) punya jalur masuk sendiri ke sistem, tapi semuanya bermuara ke format kanonik yang sama dari Fase 0.

**Deliverable per sumber:**

| Sumber | Bentuk input realistis | Adapter yang dibutuhkan |
|---|---|---|
| Government (Dinas Pariwisata/UMKM) | Kemungkinan besar: Excel/CSV export, mungkin PDF laporan, jarang API real-time | Batch import adapter + validator (bukan real-time sync di awal) |
| Business self-reg | Form pendaftaran di app/portal | Form → API endpoint → antrian moderasi/verifikasi |
| Traveler signals | Event dari app (search, klik, booking, rating, "laporkan info salah") | Event logging sederhana (append-only log dulu, bukan real-time stream processing) |

**Catatan realistis:** jangan asumsikan Dinas akan kasih data dalam format rapi. Adapter Government harus tahan terhadap format berantakan (kolom gak konsisten, nama entitas beda ejaan). Ini kerja "membersihkan spreadsheet", bukan integrasi API — rencanakan effort sesuai itu.

**Definisi selesai:** satu file data dummy/sample dari tiap sumber berhasil masuk ke format kanonik tanpa manual fix.

---

## FASE 2 — Normalization & Entity Resolution

**Tujuan:** menyatukan data yang datang dari sumber berbeda jadi satu record per entity nyata, dengan trust score yang benar.

**Deliverable:**
1. Fuzzy matching pipeline (nama + lokasi + kategori) untuk deteksi duplikat lintas sumber.
2. Merge logic: kalau field yang sama punya nilai beda dari 2 sumber, field mana yang menang (berdasarkan `trust_score` dan `freshness_timestamp` dari Fase 0).
3. Antrian "butuh review manual" untuk kasus ambigu (fuzzy match confidence rendah) — di fase awal ini boleh direview manual oleh kamu/tim, bukan otomatis penuh.

**Definisi selesai:** dataset sample dari 2 sumber berbeda (mis. UMKM yang sama muncul di data Dinas Pariwisata dan Dinas UMKM) berhasil di-merge jadi satu record dengan field yang benar menang.

---

## FASE 3 — Core Data Store

**Tujuan:** tempat penyimpanan final, siap di-query oleh AI Engine.

**Deliverable:**
1. Skema database relasional (PostgreSQL cukup) sesuai entity dari Fase 0, dengan foreign key antar entity (Destination ↔ Business/UMKM/Event/Route).
2. Index untuk query yang bakal sering dipakai AI Engine: lokasi (geospatial), kategori, harga range, jam operasional.
3. Versioning/audit trail sederhana — siapa/sumber apa yang terakhir update tiap field (dibutuhkan untuk transparansi ke dashboard pemerintah nanti).

**Definisi selesai:** data hasil Fase 2 tersimpan dan bisa di-query dengan filter kombinasi (kategori + lokasi + harga) dalam waktu wajar.

---

## FASE 4 — AI Engine

**Tujuan:** dari data yang sudah bersih, hasilkan itinerary yang akurat dan personal.

**Deliverable, dipecah 3 sub-komponen (sesuai arsitektur):**

1. **Retrieval** — query Core Data Store berdasarkan constraint keras user (budget, durasi, jarak, kategori). Ini query database biasa, belum butuh AI.
2. **Ranking** — urutkan kandidat hasil retrieval berdasarkan sinyal traveler (kalau belum ada history: default ke rating/popularitas; kalau sudah ada: personalisasi).
3. **LLM composition** — hasil retrieval + ranking di-pass ke LLM untuk disusun jadi itinerary naratif per jam. **Prompt harus eksplisit melarang LLM menambah fakta di luar data yang diberikan** (nama tempat, harga, jam buka HARUS dari Core Data Store, bukan dari training data LLM).

**Definisi selesai:** input preferensi dummy (budget, durasi, kategori) menghasilkan itinerary yang semua fakta di dalamnya bisa ditelusuri balik ke record di Core Data Store — tidak ada yang "dikarang" LLM.

---

## FASE 5 — Output Layer

**Tujuan:** dua permukaan output dari data & AI yang sama.

**Deliverable:**
1. **Traveler output:** discovery feed + trip planner UI. Booking real (payment) sengaja ditunda — cukup kontak langsung ke Business dulu.
2. **Government output:** dashboard read-only — jumlah destinasi/UMKM terdata, sinyal traveler agregat (destinasi trending, dsb). Ini bisa dibangun belakangan setelah Traveler output stabil, karena butuh data traffic nyata dulu supaya dashboard-nya ada isinya.

---

## FASE 6 — Feedback Loop

**Tujuan:** menutup lingkaran — interaksi traveler memperkaya data dan AI, bukan cuma konsumsi satu arah.

**Deliverable:**
1. Event dari traveler (klik, booking, rating, "laporkan info salah") ditulis balik sebagai sinyal yang mempengaruhi `trust_score` dan ranking di Fase 2/4.
2. Agregasi sinyal ini juga jadi input ke Government dashboard (Fase 5).

**Catatan:** fase ini baru bermakna kalau sudah ada traffic traveler nyata — jangan dibangun canggih dari awal sebelum ada data untuk dipelajari.

---

## Urutan eksekusi yang disarankan

Bukan strict linear — beberapa bisa paralel:

```
Fase 0 (kontrak data)
   │
   ├──► Fase 1 (ingestion) ──► Fase 2 (normalization) ──► Fase 3 (data store)
   │                                                              │
   │                                                              ▼
   └──► (paralel) siapkan skema AI Engine (Fase 4) pakai data dummy manual,
        supaya begitu Fase 3 selesai, tinggal sambung — tidak nunggu total
                                                              │
                                                              ▼
                                                    Fase 5 (Traveler output dulu)
                                                              │
                                                              ▼
                                                    Fase 6 (feedback loop) + 
                                                    Fase 5b (Government dashboard)
```

Alasan Fase 4 disiapkan paralel dengan data dummy: supaya validasi "apakah AI planner-nya beneran kepake" tidak menunggu pipeline data Government/Business selesai penuh — sesuai concern soal validasi produk yang sempat dibahas sebelumnya.

---

## Yang sengaja TIDAK masuk blueprint ini (untuk fase 1 kota pilot)

- Payment gateway / booking transaksional penuh
- Multi-tenant architecture untuk banyak kota
- Graph database
- Real-time data sync dengan sistem Dinas
- Mobile native app (web app cukup untuk validasi awal)

Ini semua sah untuk roadmap jangka panjang, tapi menambahnya sekarang akan memperlambat validasi inti: apakah data + AI Engine ini menghasilkan itinerary yang beneran berguna buat traveler.
