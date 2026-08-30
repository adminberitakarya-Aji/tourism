# Field Write-Authority Matrix (Fase 0.9)

> Status: **Disetujui** (30/08/2026). Dokumen ini adalah **spesifikasi kontrak**, bukan implementasi.
> Penegakannya (enforcement di endpoint/migration) baru menyusul di Fase 1–3.
> Mengubah isi dokumen ini = mengubah kontrak penulisan data antar layer — wajib konfirmasi user dulu (lihat `agents.md` §5).

## 1. Tujuan

Mendefinisikan **siapa boleh menulis field apa** pada tiap entity kanonik, dan **prioritas siapa menang saat dua sumber mengisi field yang sama dengan nilai berbeda**. Ini melengkapi dua kontrak sebelumnya:

- `trust-metadata.md` (0.7) → *bagaimana* kualitas per field dicatat.
- `entity-resolution.md` (0.8) → *kapan* record dianggap sama.

Matriks ini menjawab pertanyaan yang tersisa: *setelah dedup, field siapa yang menang?*

## 2. Peran (actor)

| Peran | Contoh aktor nyata | Karakter penulisan |
|---|---|---|
| `government` | Dinas Pariwisata / Pemda (feed CSV/Excel, task 1.1–1.2) | Fakta resmi, sumber paling tepercaya (trust 1.0) |
| `business` | Pelaku usaha via self-registration (task 1.3) | Data operasional dirinya sendiri (trust 0.7) |
| `traveler` | Wisatawan (rating, lapor info salah — task 1.4, 6.1) | **Tidak pernah menulis field faktual**; hanya sinyal (trust 0.5, dan hanya ke data sinyal) |
| `system` | Proses internal: entity resolution merge, trust decay | Ditulis otomatis oleh platform, bukan oleh manusia |

## 3. Matriks write-authority

Legend: ✅ = boleh menulis (create & update) · 👁 = read-only · ➕ = boleh menambah, tidak boleh menimpa

### Destination

| Field group | Government | Business | Traveler | Prioritas saat konflik |
|---|---|---|---|---|
| `name`, `description` | ✅ | 👁 (boleh usulkan koreksi via lapor) | 👁 | government |
| `category`, `location` | ✅ | 👁 | 👁 | government |
| `ticketPrice`, `operatingHours` | ✅ | 👁 | 👁 | government |
| `contact` | ✅ (sebagai verifier) | ➕ boleh isi jika kosong | 👁 | government > business |
| sinyal (`rating`, `report`) | 👁 | 👁 | ✅ (via event logging, bukan langsung ke entity) | — |

### Business

| Field group | Government | Business (milik sendiri) | Traveler | Prioritas saat konflik |
|---|---|---|---|---|
| `status` (`pending_review`/`verified`) | ✅ | 👁 | 👁 | government (verifikasi manual, task 1.5) |
| `name`, `businessType`, `location`, `description` | ✅ (koreksi) | ✅ saat submit/awal; setelah verified hanya ➕ usulan | 👁 | business > government *hanya sebelum verified*; setelah itu government |
| `operatingHours`, `priceRange`, `contact` | 👁 | ✅ | 👁 | business (data operasional adalah domainnya) |
| sinyal (`rating`, `report`) | 👁 | 👁 | ✅ (via event logging) | — |

### UMKM

| Field group | Government | Business/Pemilik (milik sendiri) | Traveler | Prioritas saat konflik |
|---|---|---|---|---|
| struktur field | identik dengan Business | identik | identik | identik |

*(UMKM mengikuti matriks Business — keduanya self-registered + verifikasi manual; perbedaannya hanya skema, bukan authority.)*

### Event

| Field group | Government | Business/Penyelenggara | Traveler | Prioritas saat konflik |
|---|---|---|---|---|
| `title`, `startsAt`, `endsAt`, `venue`, `destinationId` | ✅ | ✅ (untuk event miliknya sendiri) | 👁 | government > business saat keduanya mengisi dan beda nilai |
| sinyal | 👁 | 👁 | ✅ (via event logging) | — |

### Route

| Field group | Government | Business | Traveler | Prioritas saat konflik |
|---|---|---|---|---|
| semua field (`stops`, durasi, dsb.) | 👁 | 👁 | ✅ (itinerary adalah milik traveler) | traveler |

*(Route adalah komposisi buatan traveler/AI — satu-satunya entity yang traveler menjadi penulis utamanya. Tidak di-dedup, lihat 0.8.)*

## 4. Aturan penyelesaian konflik (urutan penilaian)

Saat dua sumber mengisi field yang sama dengan nilai berbeda:

1. **Authority matrix di atas menang lebih dulu** — field yang di-lock ke `government` tidak bisa ditimpa oleh `business`, berapa pun `freshness`-nya.
2. **Jika authority setara** (mis. dua feed government berbeda versi): `trust_score` lebih tinggi menang (lihat `DEFAULT_TRUST_SCORE_BY_SOURCE` di core).
3. **Jika trust setara**: `freshness_timestamp` terbaru menang.
4. **Nilai yang kalah tidak dibuang** — disimpan di riwayat audit field (ditulis saat task 3.5 audit field) supaya keputusan merge bisa ditelusuri/dipulihkan.

## 5. Konsekuensi implementasi (checklist untuk task berikutnya)

- [ ] Endpoint self-registration (1.3) harus memaksa `status: pending_review` server-side, tidak menerima nilai itu dari client.
- [ ] Enkapsulasi aturan prioritas ini menjadi satu fungsi di `packages/core` (mis. `resolveFieldValue()`) saat Fase 3 — jangan tersebar di banyak service.
- [ ] Verifikasi business (1.5) adalah satu-satunya jalur `pending_review → verified`.
- [ ] Traveler tidak pernah punya endpoint yang menulis field entity; hanya event logging append-only (1.4).

## 6. Sengaja belum ada di fase ini (anti over-engineering)

- Penegakan otomatis di level database (RLS/trigger) — kontrak dipegang di lapisan service (Fase 3).
- Alur "usulkan koreksi" formal untuk business/traveler (boarding ke Fase 6 feedback loop).
- Multi-level government (kabupaten vs provinsi) — pilot 1 kota, semua government dianggap setara.
