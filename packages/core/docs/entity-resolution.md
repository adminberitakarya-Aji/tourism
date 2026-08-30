# Entity Resolution Key Spec (Fase 0.8)

> Status: **Disetujui** (30/08/2026). Dokumen ini adalah **spesifikasi**, bukan implementasi.
> Implementasi fuzzy matching baru di task 2.1; manual review queue di 2.3.
> Mengubah isi dokumen ini = mengubah kontrak dedup antar layer — wajib konfirmasi user dulu (lihat `agents.md` §5).

## 1. Tujuan

Mendefinisikan **cara mendeteksi dua record yang merujuk tempat/hal yang sama** sebelum data masuk ke core store. Ini pencegahan di level kontrak (bukan di level kode) terhadap duplikasi akibat multi-sumber ingest (government feed, business self-reg, dsb — lihat `tourism-platform-blueprint.md`).

## 2. Prinsip

1. **Matching = kombinasi key, bukan satu field.** Nama saja tidak cukup ("Warung Bu Sari" bisa ada 3 di satu kota).
2. **Deterministik.** Normalisasi nama didefinisikan eksplisit di sini supaya hasil matching dapat direproduksi dan diuji.
3. **Blocking → scoring → keputusan.** Kandidat disaring murah dulu (blocking key), baru diberi skor kemiripan, lalu diputuskan: merge otomatis / manual review / entitas baru.

## 3. Normalisasi nama (dipakai semua entity)

Urutan operasi terhadap nilai `name`/`title`:

1. Unicode NFC normalize + lowercase (termasuk aksara lokal).
2. Hapus semua tanda baca (`,.!?;:'"()-/&`) → ganti dengan spasi.
3. Runtuhkan spasi ganda, trim.
4. Hapus stopword awalan umum (hanya jika berada di awal string): `warung`, `toko`, `rumah`, `wisata`, `pantai`, `restaurant`, `resto`, `cafe`, `hotel`.
   - **Catatan:** hanya dihapus sebagai **awalan**. "Pantai Kondang Linggar" tetap mengandung "kondang linggar" setelah normalisasi — makna "pantai" yang jadi bagian nama tidak hilang dari skor karena kategori entity sudah menyimpan tipe.
5. Hasil = `normalized_name`, dipakai di blocking key dan sebagai input skor kemiripan.

## 4. Kombinasi key per entity

| Entity | Blocking key (kandidat) | Sinyal pendukung (masuk skor) | Merge otomatis | Manual review |
|---|---|---|---|---|
| `Destination` | `normalized(name)` + `category` + koordinat dalam **radius 500 m** | `operatingHours` sama, alamat sama | skor ≥ **0.9** | 0.75 ≤ skor < 0.9 |
| `Business` | `normalized(name)` + `businessType` + koordinat dalam **radius 300 m** | `destinationId` sama, `contact` sama | skor ≥ **0.9** | 0.75 ≤ skor < 0.9 |
| `UMKM` | `normalized(name)` + `category` + koordinat dalam **radius 300 m** | `products` overlap, `contact` sama | skor ≥ **0.9** | 0.75 ≤ skor < 0.9 |
| `Event` | `normalized(title)` + `startsAt` (tanggal kalender sama) + `venue` (jika ada) | `destinationId` sama | skor ≥ **0.9** | 0.75 ≤ skor < 0.9 |
| `Route` | **Tidak di-dedup** — komposisi buatan traveler/AI; duplikat valid secara alami | — | — | — |

### Catatan per baris

- **Destination — 500 m:** pilot 1 kota; dua "objek wisata" berbeda jarang < 500 m satu sama lain. Kalau nanti multi-kota/padat, angka ini di-tune di Fase 2.
- **Business/UMKM — 300 m:** dua warung/gerai berbeda bisa sangat dekat (satu jalan), jadi radius lebih ketat + `businessType` wajib sama.
- **Event — tanggal kalender sama** (bukan per jam): event yang sama kadang di-update jam-nya antar sumber.
- **Koordinat radius** dihitung haversine pada kandidat hasil blocking (bukan perbandingan DB penuh) — konsisten keputusan D2 (bounding box + `findNearby` terpusat).

## 5. Skor kemiripan (rumus v0, sengaja sederhana)

```
score = 0.6 * nameSimilarity        // Levenshtein ratio pada normalized_name
      + 0.2 * locationProximity     // 1.0 jika dalam radius, linier turun sampai 0 di 2× radius
      + 0.2 * supportSignalScore    // rata-rata sinyal pendukung yang cocok (0 jika tidak ada)
```

- Semua bobot dan ambang **adalah nilai awal yang sengaja sederhana**; akan di-tune di Fase 2 setelah ada data nyata. Perubahan bobot/ambang = perubahan dokumen ini.
- `nameSimilarity` = `1 - (levenshtein(normalized_a, normalized_b) / max(len_a, len_b))`.

## 6. Keputusan hasil matching

| Skor | Aksi | Catatan |
|---|---|---|
| ≥ 0.9 | **Auto-merge** | Record baru ditandai `merged_into` → id survivor; field yang `trust_score` lebih rendah tidak menimpa yang lebih tinggi (kontrak `trust-metadata.md`) |
| 0.75 – 0.9 | **Manual review queue** (task 2.3) | Reviewer melihat kedua record berdampingan, pilih merge/tetap terpisah |
| < 0.75 | **Entitas baru** | Masuk core store dengan source & trust score dari sumbernya |

## 7. Sengaja belum ada di fase ini (anti over-engineering)

- Implementasi algoritma matching & skor (→ task 2.1).
- Antrian review UI (→ task 2.3).
- Tuning bobot/ambang berbasis data (→ Fase 2, setelah ada data pilot).
- Embedding/semantic similarity — hanya dipertimbangkan kalau Levenshtein terbukti tidak cukup di Fase 2.
