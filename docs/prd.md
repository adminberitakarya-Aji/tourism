# PRD — Tourism Platform (Fase Pilot 1 Kota)

## 1. Problem Statement & Positioning

Wisatawan domestik Indonesia punya banyak sumber inspirasi (TikTok, Instagram, Google Maps) tapi nol personalisasi dan nol eksekusi — mereka harus merangkai sendiri jadi itinerary, tanpa tahu jam buka aktual, harga real, atau apakah destinasi sedang ramai.

Platform ini bukan katalog wisata lain. Positioning-nya: **AI trip planner yang menyusun itinerary personal dari data resmi daerah**, terhubung ke pelaku usaha lokal (UMKM, guide, resto) — bukan sekadar daftar tempat.

Diferensiasi vs pemain existing (Traveloka/Tiket.com = transaksi tanpa personalisasi; Google Maps/TripAdvisor = discovery pasif; TikTok/IG = inspirasi tanpa eksekusi): platform ini menggabungkan personalisasi + data resmi + jalur ke pelaku usaha lokal dalam satu alur.

## 2. Target User & Use Case Utama (Fase Pilot)

**Primary user — Traveler:**
Wisatawan domestik yang berkunjung ke kota pilot, butuh itinerary cepat tanpa riset manual berjam-jam. Use case utama: "Saya di [Kota], [durasi] hari, budget [X], suka [preferensi] — susunkan itinerary saya."

**Secondary user — Government (Dinas Pariwisata/UMKM kota pilot):**
Butuh visibilitas: destinasi/UMKM mana yang ramai dicari, data kunjungan agregat, tanpa perlu effort tambahan input data mereka sendiri sehari-hari (data awal dari mereka, insight balik ke mereka).

**Business (Hotel/Resto/Guide/UMKM) — dilayani secara tidak langsung di fase ini:**
Muncul sebagai listing di itinerary. Self-registration ada, tapi belum jadi fokus akuisisi aktif di fase pilot.

## 3. Core Features MVP — vs Ditunda

### Masuk MVP:
- **AI Trip Planner** — input preferensi (durasi, budget, jumlah orang, kategori minat) → output itinerary per jam, dari data resmi (bukan LLM mengarang).
- **Discovery / listing page** per destinasi/UMKM/resto/experience — foto, deskripsi, harga, jam buka, cara ke sana.
- **Kontak langsung ke Business** (WA/telepon) untuk booking — bukan transaksi in-app.
- **Business self-registration** (form pendaftaran + verifikasi manual) — sesuai arsitektur "data source ≠ owner ecosystem".
- **Government dashboard (read-only)** — jumlah destinasi/UMKM terdata, destinasi/kategori trending berdasarkan sinyal traveler.
- **Feedback signal dari traveler** — rating, "laporkan info salah" — masuk ke trust_score data.

### Ditunda (bukan fase ini):
- In-app booking & payment gateway
- Multi-kota / multi-tenant
- Native app (mulai dari web app, lihat keputusan arsitektur Fase 0 blueprint)
- PWA enhancement (manifest, service worker) — ditambah setelah web app tervalidasi
- Social layer (share/clone itinerary orang lain)
- Personalisasi berbasis history (fase ini masih single-session preference, belum learning jangka panjang per user)

## 4. User Flow Utama

**Traveler flow:**
1. Buka web app → input preferensi trip (durasi, budget, jumlah orang, kategori minat, tanggal opsional)
2. AI Engine generate itinerary per jam (retrieval dari data resmi → ranking → LLM composition)
3. Traveler lihat itinerary, bisa klik tiap stop untuk detail (foto, harga, jam buka, kontak)
4. Traveler hubungi Business langsung untuk booking (keluar dari app, ke WA/telepon)
5. Traveler bisa rating stop yang sudah dikunjungi / laporkan info yang salah → masuk feedback loop

**Government flow:**
1. Login ke dashboard (akses terbatas, per kota/dinas)
2. Lihat ringkasan: jumlah entitas terdata, breakdown per kategori
3. Lihat tren: destinasi/kategori yang paling sering muncul di itinerary traveler, rating rata-rata
4. (Belum di MVP) Ekspor laporan / drill-down detail per entitas

**Business flow:**
1. Isi form self-registration (nama usaha, kategori, lokasi, harga, jam operasional, kontak)
2. Masuk antrian verifikasi manual (tim internal cek kelayakan)
3. Setelah approve, listing muncul di Discovery & bisa direkomendasikan AI Engine

## 5. Success Metric Fase Pilot

Karena ini fase validasi, metrik utamanya bukan jumlah download, tapi **apakah itinerary yang dihasilkan AI benar-benar dipakai**:

- **Completion rate**: % traveler yang generate itinerary dan benar-benar membuka detail minimal 1 stop
- **Contact-out rate**: % itinerary yang menghasilkan minimal 1 klik "hubungi" ke Business — proxy untuk "itinerary ini cukup meyakinkan untuk ditindaklanjuti"
- **Akurasi data**: % laporan "info salah" dari traveler dibanding total interaksi — makin rendah makin baik
- **Business self-registration**: jumlah pendaftaran organik dari pelaku usaha (sinyal bahwa platform mulai punya nilai tanpa perlu di-drive manual)

Metrik eksplisit yang **tidak** dipakai di fase ini: revenue, jumlah kota, jumlah download — semua itu terlalu dini dan tidak mencerminkan apakah core value prop (AI planner) benar-benar bekerja.
