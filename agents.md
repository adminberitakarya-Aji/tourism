# agents.md — Tourism Platform

Dokumen ini adalah aturan main untuk AI coding agent (termasuk Claude) yang bekerja di repo ini. Tujuannya: konsisten dengan arsitektur yang sudah diputuskan di `blueprint`, `prd.md`, dan `implementation-plan.md` — bukan mengambil keputusan baru sendiri.

---

## 1. Referensi wajib dibaca sebelum kerja

- `tourism-platform-blueprint.md` — arsitektur data & folder
- `prd.md` — scope produk, apa yang masuk/tidak masuk MVP
- `implementation-plan.md` — task list & status per fase
- `decisions.md` — keputusan teknis yang sudah disepakati (ORM, geospatial, auth, LLM provider) — JANGAN dibatalkan atau diubah tanpa konfirmasi user
- `docs/ui-ux-master-blueprint.md` — spesifikasi UI/UX master untuk `apps/web` (mobile-first, web → PWA → Native). **Wajib dibaca sebelum pekerjaan UI/Fase 5 ke atas** — desain visual, alur halaman, dan komponen mengikuti dokumen ini, bukan dikarang sendiri

> Catatan lokasi: dokumen-dokumen di atas kini berada di folder `docs/` (kecuali `agents.md` ini yang tetap di root).

Kalau ada instruksi yang bertentangan dengan salah satu dokumen ini, **berhenti dan konfirmasi ke user dulu** — jangan asumsikan dokumen mana yang lebih benar.

---

## 2. Struktur folder & boundary antar package

```
apps/web/         → Next.js. Frontend only (SSR + UI). TIDAK BOLEH berisi business logic
                     atau dipakai sebagai backend (jangan taruh logic di API routes-nya).
apps/mobile/       → belum dibuat di fase ini. Jangan buat folder ini sebelum diminta eksplisit.
packages/core/     → business logic murni, framework-agnostic. Tidak boleh import dari
                     Next.js/React/NestJS. Ini yang dipakai ulang lintas apps/*.
packages/api-client/ → satu-satunya lapisan pemanggilan API dari sisi client. apps/web
                     TIDAK BOLEH fetch langsung ke services/api tanpa lewat sini.
packages/ui/       → belum diisi di fase ini. Jangan buat komponen di sini sebelum diminta.
services/api/      → NestJS. Satu-satunya sumber data/logic backend. apps/web adalah
                     KONSUMEN, bukan pemilik logic.
```

**Aturan keras:**
- Jangan pernah menaruh business logic (validasi domain, AI Engine logic, entity resolution) di `apps/web`. Semua itu tempatnya di `packages/core` atau `services/api`.
- Jangan buat backend kedua atau duplikasi logic API di `apps/web/pages/api/*` — itu melanggar prinsip pemisahan yang jadi alasan monorepo ini dibuat begini (lihat Fase 0 blueprint).
- Kalau sebuah fungsi dipakai baik di frontend maupun backend (mis. validasi skema entity), taruh di `packages/core`, jangan duplikasi.

---

## 3. Konvensi coding (default — bisa disesuaikan)

- **Bahasa:** TypeScript di semua package, `strict: true` di `tsconfig`.
- **Penamaan file:** kebab-case (`trip-planner.service.ts`), bukan camelCase atau PascalCase untuk nama file.
- **Penamaan variable/function:** camelCase. **Class/Type/Interface:** PascalCase.
- **Error handling (NestJS):** gunakan exception class bawaan NestJS (`BadRequestException`, `NotFoundException`, dll) untuk error yang diteruskan ke client — jangan `throw new Error()` polos di controller/service yang menghadap API.
- **Tidak ada silent catch** — setiap `try/catch` yang menelan error tanpa log atau re-throw harus dihindari; kalau error memang boleh diabaikan, beri komentar kenapa.
- **Validasi input:** semua endpoint NestJS wajib pakai DTO + `class-validator`, tidak menerima payload mentah tanpa validasi.

*(Kalau ada preferensi lain yang beda dari default ini, override di sini — dokumen ini yang jadi source of truth, bukan asumsi individual di tiap sesi.)*

---

## 4. Cara kerja agent di repo ini

Berlaku untuk semua kerjaan, bukan cuma fase awal:

1. **Skeleton/spesifikasi dulu, dikonfirmasi, baru isi file.** Jangan langsung menulis implementasi lengkap sebelum struktur/pendekatannya disetujui.
2. **Satu file per satu waktu.** Jangan generate banyak file sekaligus dalam satu batch tanpa direview.
3. **Status task di `implementation-plan.md` diubah jadi Done HANYA setelah dikonfirmasi eksplisit** oleh user bahwa file ada di repo dan acceptance criteria-nya terpenuhi — bukan diasumsikan otomatis.
4. **`implementation-plan.md` hanya diupdate kalau diminta**, tidak proaktif diubah sendiri oleh agent di luar sesi yang diminta.
5. **Verifikasi klaim terhadap kode aktual**, bukan percaya begitu saja pada commit message atau dokumentasi lama. Kalau ditemukan dokumentasi yang sudah tidak sesuai kode (drift), tandai secara eksplisit — jangan diam-diam dibiarkan atau diam-diam diperbaiki tanpa disebut.
6. **Jangan over-engineering di fase mock/prototype.** Kalau task-nya masih tahap validasi (data dummy, fase pilot), jangan menambahkan abstraksi/infrastruktur yang baru relevan untuk skala produksi penuh (lihat daftar "sengaja tidak masuk blueprint" di `tourism-platform-blueprint.md`).

---

## 5. Wajib konfirmasi dulu sebelum agent melakukan ini sendiri

- Mengubah skema kanonik entity di `packages/core` (dampaknya menjalar ke semua layer).
- Menambah dependency baru ke `package.json` mana pun.
- Membuat folder/package baru di luar struktur Fase 0 (mis. `apps/mobile`, `packages/ui`) sebelum saatnya.
- Mengubah struktur database (migration) tanpa review skema dulu.
- Mengubah scope MVP yang sudah ditetapkan di `prd.md` (fitur yang sengaja ditunda tidak boleh ditambah diam-diam "biar lengkap").
