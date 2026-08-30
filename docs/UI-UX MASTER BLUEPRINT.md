# UI/UX MASTER BLUEPRINT
## Indonesia Tourism Platform — Web Mobile-First

**Version:** 1.0  
**Status:** Master UI/UX Specification  
**Target:** `apps/web` — Stage 1  
**Future:** PWA → Native Mobile  
**Visual Reference:** Master Product Visual / Concept Board

---

# 1. PRODUCT UI/UX VISION

## 1.1 Product Positioning

Indonesia Tourism Platform bukan diposisikan sebagai "aplikasi pemerintah".

Di sisi traveler, produk harus terasa seperti:

> **A modern, trusted platform to discover and experience Indonesia.**

Government adalah sumber otoritatif di belakang layar.

Traveler melihat:

- Indonesia
- destinasi
- kuliner
- event
- UMKM
- desa wisata
- itinerary
- AI travel intelligence

Bukan struktur pemerintahan.

---

# 2. CORE UX PRINCIPLE

```text
DISCOVER
   ↓
UNDERSTAND
   ↓
PLAN
   ↓
EXPERIENCE
   ↓
FEEDBACK
   ↓
BETTER DATA
   ↓
BETTER DISCOVERY
```

Traveler tidak dipaksa memahami sistem data.

Semua kompleksitas:

- source
- trust
- freshness
- entity resolution
- ranking
- AI retrieval

berada di belakang UI.

---

# 3. DEVICE STRATEGY

## Stage 1

### Primary

**Mobile-first responsive web**

Target utama:

```text
Mobile
375px
390px
414px
```

### Secondary

Tablet.

### Desktop

Digunakan terutama untuk:

- traveler desktop
- government dashboard
- business portal

---

# 4. RESPONSIVE PRINCIPLE

Mobile bukan versi kecil dari desktop.

Mobile adalah:

> **Primary experience.**

Desktop adalah:

> **Expanded experience.**

---

# 5. GLOBAL NAVIGATION

## Mobile

Bottom navigation:

```text
┌─────────────────────────────────┐
│                                 │
│           CONTENT               │
│                                 │
├─────────────────────────────────┤
│  Home  Search  Trips  Saved  Me │
└─────────────────────────────────┘
```

### Navigation

1. Home
2. Search
3. Trips
4. Saved
5. Profile

---

## Desktop

Top navigation:

```text
LOGO

Explore
Destinations
Kuliner
Events
Desa Wisata
UMKM
Trip Planner

                         Search
                         Profile
```

---

# 6. GLOBAL UI SYSTEM

## 6.1 Visual Character

Design language:

- clean
- premium
- modern
- trustworthy
- photographic
- spacious
- approachable
- Indonesian
- not bureaucratic

---

# 7. COLOR SYSTEM

Primary:

```text
Primary Blue
Used for:
- CTA
- active state
- links
- navigation
- AI actions
```

Secondary:

```text
Green
Used for:
- verified
- open
- available
- positive status
```

Accent:

```text
Orange
Used for:
- travel highlights
- events
- discovery
- important contextual indicators
```

Neutral:

```text
White
Light Gray
Medium Gray
Dark Navy
```

Do not use excessive colors.

Color must communicate meaning.

---

# 8. TYPOGRAPHY

Typography should feel modern and highly readable.

Hierarchy:

```text
Display
H1
H2
H3
Body
Caption
Metadata
```

Mobile body text must remain highly readable.

Avoid extremely thin fonts.

---

# 9. GLOBAL COMPONENTS

The following components should become reusable components.

```text
Button
IconButton
SearchBar
Chip
FilterChip
CategoryCard
DestinationCard
BusinessCard
EventCard
UMKMCard
ImageCard
Rating
Distance
OpenStatus
VerifiedBadge
FreshnessBadge
MapPreview
BottomSheet
Modal
Toast
Snackbar
Skeleton
EmptyState
ErrorState
SectionHeader
Avatar
Navigation
BottomNavigation
TopBar
```

---

# 10. TRUST UX

Trust must be visible but not overwhelming.

Example:

```text
✓ Verified information
Updated 2 days ago
```

or:

```text
✓ Verified
Last updated 2 days ago
```

Do not display internal numerical trust scores to normal travelers.

Do not show:

```text
Trust Score: 0.94
```

Instead translate technical trust into human-readable UX.

---

# 11. SCREEN MAP

Main traveler flow:

```text
HOME
 │
 ├── Search
 │      │
 │      └── Search Results
 │               │
 │               └── Detail
 │
 ├── Explore Category
 │
 ├── Destination
 │      └── Detail
 │
 ├── AI Trip Planner
 │      └── Itinerary
 │
 ├── Trips
 │      └── Trip Detail
 │
 └── Feedback
```

---

# 12. SCREEN 01 — HOME

## Purpose

Home is the primary discovery surface.

Its job:

> Inspire the traveler and provide the fastest route toward discovery.

---

## Mobile Layout

```text
┌──────────────────────────────┐
│ Logo / Location       Profile│
│                              │
│ Hai, Traveler 👋             │
│                              │
│ Jelajahi Keindahan           │
│ Indonesia                    │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🔍 Cari destinasi...      │ │
│ └──────────────────────────┘ │
│                              │
│ [Destinasi] [Kuliner]        │
│ [Event] [Desa Wisata]        │
│ [UMKM] [Trip Planner]        │
│                              │
│ Destinasi Populer            │
│                              │
│ ┌────────────┐ ┌───────────┐ │
│ │            │ │           │ │
│ │   PHOTO    │ │   PHOTO   │ │
│ │            │ │           │ │
│ │ Bali       │ │ Labuan... │ │
│ └────────────┘ └───────────┘ │
│                              │
│ Event Terdekat               │
│                              │
│ ┌──────────────────────────┐ │
│ │ Event Card               │ │
│ └──────────────────────────┘ │
│                              │
│ Desa Wisata                  │
│                              │
├──────────────────────────────┤
│ Home Search Trips Saved Me   │
└──────────────────────────────┘
```

---

## Components

### Header

Contains:

- logo
- current location
- profile

Location should be optional.

---

### Hero

Large destination photography.

Headline:

> Jelajahi Keindahan Indonesia

Subheadline:

> Temukan destinasi, kuliner, event, dan pengalaman lokal.

---

### Search

Primary CTA on home.

Placeholder:

> Cari destinasi, kota, kuliner...

---

### Category Grid

Initial categories:

```text
Destinasi
Kuliner
Event
Desa Wisata
UMKM
Trip Planner
Transport
Guide
```

---

## Home States

### Loading

Use skeleton:

```text
Hero Skeleton

Search Skeleton

Category Skeleton

Destination Card Skeleton
```

Do not show blank white page.

---

### Empty

If no personalized recommendations:

> Mulai jelajahi Indonesia dan temukan tempat favoritmu.

CTA:

> Jelajahi Destinasi

---

### Error

If recommendation service fails:

> Rekomendasi belum tersedia.

CTA:

> Coba Lagi

The rest of the home page should remain usable.

---

# 13. SCREEN 02 — SEARCH

## Purpose

Allow traveler to find relevant tourism entities quickly.

---

## Mobile

```text
┌──────────────────────────────┐
│ ← Search                     │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🔍 Yogyakarta             │ │
│ └──────────────────────────┘ │
│                              │
│ [Semua] [Alam] [Budaya]     │
│ [Kuliner] [UMKM] [Event]    │
│                              │
│ Filter     Sort       Map    │
│                              │
│ 184 hasil                    │
│                              │
│ ┌──────────────────────────┐ │
│ │ IMAGE                    │ │
│ │ Candi Prambanan          │ │
│ │ ⭐ 4.8                   │ │
│ │ ✓ Verified               │ │
│ │ 🟢 Buka                  │ │
│ │ 12 km                    │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ IMAGE                    │ │
│ │ HeHa Sky View            │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

---

# 14. SEARCH FILTER

Filter bottom sheet:

```text
FILTER

Lokasi
[Current Location]

Kategori
☐ Alam
☐ Budaya
☐ Kuliner
☐ UMKM
☐ Event

Jarak
○ < 5 km
○ < 10 km
○ < 25 km

Status
☐ Buka sekarang
☐ Verified

Budget
Rp ______

Waktu
[Today]

[Reset]        [Terapkan]
```

---

# 15. SEARCH SORT

Initial:

```text
Relevan
Terdekat
Populer
Rating tertinggi
Terbaru
```

Future:

```text
Recommended for you
```

---

# 16. SEARCH STATES

## Initial

No query:

> Mau menjelajahi apa?

Display:

- popular searches
- nearby
- categories
- trending

---

## Loading

Skeleton cards.

---

## Results

Show:

- count
- cards
- filters
- map option

---

## Empty

```text
Tidak menemukan tempat yang cocok.

Coba:
- kata pencarian lain
- kategori berbeda
- lokasi lebih luas
```

CTA:

> Reset Filter

---

## Error

> Pencarian sedang bermasalah.

CTA:

> Coba Lagi

---

# 17. SCREEN 03 — DESTINATION DETAIL

## Purpose

Convert discovery into confidence and action.

This screen is critical.

---

## Mobile Structure

```text
┌──────────────────────────────┐
│ ←                     ♡  ⋯   │
│                              │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │         PHOTO            │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ Candi Prambanan              │
│ ⭐ 4.8   8.2K reviews        │
│                              │
│ ✓ Verified information       │
│ Updated 2 days ago           │
│                              │
│ 📍 Yogyakarta                │
│ 🟢 Buka · 06:00–17:00       │
│ 🎟️ Mulai Rp60.000           │
│                              │
│ [Tambah ke Trip]             │
│                              │
│ Tentang                      │
│ ───────────────────────────  │
│ Description...               │
│                              │
│ Informasi                    │
│ Jam buka                     │
│ Harga                        │
│ Fasilitas                    │
│                              │
│ UMKM & Kuliner Sekitar       │
│                              │
│ [Card] [Card] [Card]         │
│                              │
│ Event                        │
│                              │
│ Rekomendasi                  │
│                              │
└──────────────────────────────┘
```

---

# 18. DETAIL COMPONENTS

## Hero Gallery

Support:

- primary image
- gallery
- image count

Future:

- video
- 360°
- user-generated media

---

## Identity

Display:

```text
Name
Category
Rating
Review count
Location
```

---

## Trust

Display only useful information:

```text
✓ Verified information
Updated 2 days ago
```

Potential future:

> Verified by local tourism authority

Only when source relationship permits this wording.

---

## Operational Information

Examples:

```text
Open
06:00–17:00

Ticket
Rp60.000

Distance
12 km

Estimated visit
2–3 hours
```

Only show facts available from trusted sources.

---

# 19. DETAIL ACTIONS

Primary:

> Tambah ke Trip

Secondary:

> Simpan

> Bagikan

> Navigasi

Future:

> Book

---

# 20. DETAIL EMPTY STATES

If no reviews:

> Belum ada ulasan traveler.

If no nearby businesses:

> Belum ada informasi bisnis sekitar.

If operating hours unavailable:

> Jam operasional belum tersedia.

Never invent missing information.

---

# 21. DETAIL ERROR STATE

If detail cannot load:

```text
Destinasi tidak dapat dimuat.

Data sedang mengalami gangguan.
```

CTA:

> Coba Lagi

---

# 22. SCREEN 04 — AI TRIP PLANNER

## Purpose

Turn traveler intent into a personalized trip.

AI Planner must feel conversational but remain structured.

---

## Entry

CTA from:

- Home
- Search
- Destination Detail
- Trips

---

# 23. AI PLANNER — MOBILE

```text
┌──────────────────────────────┐
│ ← AI Trip Planner ✨         │
│                              │
│ Rencanakan perjalananmu      │
│ dengan AI.                   │
│                              │
│ Mau ke mana?                 │
│ ┌──────────────────────────┐ │
│ │ Yogyakarta               │ │
│ └──────────────────────────┘ │
│                              │
│ Kapan?                       │
│ ┌────────────┐ ┌───────────┐ │
│ │ 15 Aug     │ │ 17 Aug    │ │
│ └────────────┘ └───────────┘ │
│                              │
│ Berapa orang?                │
│ [-] 2 [+]                    │
│                              │
│ Apa yang kamu suka?          │
│                              │
│ [Budaya] [Kuliner]           │
│ [Alam] [Adventure]           │
│ [Santai] [Keluarga]          │
│                              │
│ Budget                       │
│ Rp500k ───────── Rp5jt       │
│                              │
│ Preferensi lainnya           │
│ ┌──────────────────────────┐ │
│ │ Contoh: tidak suka       │ │
│ │ perjalanan terlalu padat │ │
│ └──────────────────────────┘ │
│                              │
│ [✨ Buat Itinerary]          │
└──────────────────────────────┘
```

---

# 24. AI PLANNER INPUT

Minimum:

```text
Destination
Date
Duration
Traveler count
Budget
Interest
Constraints
```

Future:

```text
Travel style
Mobility
Dietary preferences
Accommodation
Transport preference
Children
Accessibility
```

Only expose advanced options when useful.

---

# 25. AI PLANNER LOADING

Do not simply show:

> Loading...

Use meaningful stages:

```text
✨ Memahami rencana perjalananmu...
✓ Mencari destinasi yang sesuai...
✓ Memeriksa waktu dan jarak...
○ Menyusun itinerary...
```

The progress must represent actual system stages where technically possible.

Do not fake progress.

---

# 26. AI PLANNER ERROR

If AI fails:

> Kami belum berhasil menyusun itinerary.

Provide:

> Coba lagi

and:

> Lihat rekomendasi manual

The traveler should not be blocked by AI failure.

---

# 27. AI GROUNDING UX

AI-generated itinerary must visually distinguish:

### Verified fact

```text
✓ Informasi terverifikasi
```

### Recommendation

```text
Rekomendasi untukmu
```

Never make generated reasoning appear as factual source data.

---

# 28. SCREEN 05 — ITINERARY

## Purpose

Turn AI output into an actionable travel plan.

---

## Mobile

```text
┌──────────────────────────────┐
│ ← Trip ke Yogyakarta     ⋯   │
│                              │
│ 15–17 Aug · 2 Orang         │
│                              │
│ [Ringkasan] [Hari 1] [Hari2]│
│                              │
│ ┌──────────────────────────┐ │
│ │ MAP                      │ │
│ │                          │ │
│ │ pins + route             │ │
│ └──────────────────────────┘ │
│                              │
│ HARI 1                       │
│                              │
│ 08:00                        │
│ Candi Prambanan              │
│ ✓ Verified                   │
│                              │
│        │                     │
│        │                     │
│ 11:00                        │
│ Kuliner                      │
│                              │
│        │                     │
│ 14:00                        │
│ Malioboro                    │
│                              │
│ 19:00                        │
│ Angkringan                   │
│                              │
│ [Simpan Trip] [Bagikan]      │
└──────────────────────────────┘
```

---

# 29. ITINERARY COMPONENTS

Each itinerary item:

```text
Time
Entity
Image
Distance
Estimated duration
Operational status
Trust/freshness
Notes
```

---

# 30. ITINERARY LOGIC

The UI should not allow impossible itineraries.

Example:

```text
Destination A
09:00–11:00

Travel
11:00–11:45

Destination B
11:45–13:00
```

The backend/core logic determines feasibility.

UI only presents it.

---

# 31. ITINERARY EDITING

Traveler can:

- remove stop
- reorder stop
- add destination
- regenerate day
- change budget
- change preference

Example:

> Ganti tempat ini

Then AI regenerates only the affected portion when possible.

Do not regenerate the entire trip unnecessarily.

---

# 32. ITINERARY EMPTY STATE

If no trip exists:

```text
Belum ada perjalanan.

Buat itinerary pertamamu
dengan AI.
```

CTA:

> Buat Trip

---

# 33. ITINERARY ERROR

If some destination becomes unavailable:

```text
⚠ Informasi berubah

Candi X mungkin tidak tersedia
pada waktu perjalananmu.

[ Cari alternatif ]
```

This is a major future advantage of the platform's freshness system.

---

# 34. SCREEN 06 — FEEDBACK / REPORT

## Purpose

Turn travelers into a data-quality feedback channel.

---

## Entry Points

From:

- destination detail
- business detail
- event detail
- itinerary
- search result

CTA:

> Laporkan informasi

---

# 35. REPORT SCREEN

```text
┌──────────────────────────────┐
│ ← Laporkan Informasi         │
│                              │
│ Bantu kami menjaga data      │
│ tetap akurat.                │
│                              │
│ ┌──────────────────────────┐ │
│ │ Candi Prambanan          │ │
│ │ Yogyakarta               │ │
│ └──────────────────────────┘ │
│                              │
│ Apa yang salah?              │
│                              │
│ ○ Informasi tidak akurat     │
│ ○ Tempat tutup               │
│ ○ Jam operasional berubah    │
│ ○ Harga berubah              │
│ ○ Lokasi salah               │
│ ○ Foto tidak sesuai          │
│ ○ Lainnya                    │
│                              │
│ Detail                       │
│ ┌──────────────────────────┐ │
│ │ Jelaskan masalah...      │ │
│ └──────────────────────────┘ │
│                              │
│ Tambah foto (opsional)       │
│                              │
│ [ Kirim Laporan ]            │
└──────────────────────────────┘
```

---

# 36. FEEDBACK STATES

## Sending

```text
Mengirim laporan...
```

Button disabled.

---

## Success

```text
✓ Terima kasih!

Laporanmu membantu menjaga
informasi Indonesia tetap akurat.
```

CTA:

> Kembali

---

## Error

```text
Laporan belum berhasil dikirim.
```

CTA:

> Coba Lagi

---

# 37. PROFILE / ME

Initial:

```text
Profile
│
├── My Trips
├── Saved
├── Recent
├── Feedback
├── Preferences
└── Settings
```

Do not overbuild account functionality in Stage 1.

---

# 38. SAVED

Saved entities:

```text
Destinations
Businesses
Events
Trips
```

Empty:

> Belum ada yang disimpan.

CTA:

> Jelajahi Indonesia

---

# 39. MY TRIPS

```text
My Trips

Yogyakarta
15–17 Aug

Bali
22–25 Sep

Labuan Bajo
...
```

Trip card should show:

- destination
- dates
- number of stops
- last updated
- image

---

# 40. GOVERNMENT WEB EXPERIENCE

Government interface exists inside the same web platform but has a different information architecture.

Desktop-first:

```text
Dashboard
Destinations
UMKM
Events
Reports
Analytics
Data Quality
Settings
```

---

# 41. GOVERNMENT DASHBOARD

```text
┌────────────────────────────────────────┐
│ Dashboard Pariwisata                   │
│ Yogyakarta                             │
│                                        │
│ Total Kunjungan   Destinasi   UMKM     │
│ 1.246.539         184         2.893    │
│                                        │
│ Event Aktif                              │
│ 27                                     │
│                                        │
│ ───── Trend Kunjungan ─────             │
│                                        │
│ ───────╱──────                          │
│     ╱                                  │
│ ───╯                                   │
│                                        │
│ Destinasi Trending                     │
│                                        │
│ 1. Candi Prambanan                     │
│ 2. Malioboro                           │
│ 3. HeHa Sky View                       │
│                                        │
│ Tourism Map                             │
└────────────────────────────────────────┘
```

Government dashboard should answer:

> What is happening?

> Where is demand?

> Which data is stale?

> Which destinations/businesses need attention?

---

# 42. BUSINESS / UMKM EXPERIENCE

Desktop-first but responsive.

```text
Business Portal

Dashboard
Profile
Products
Services
Photos
Statistics
Reviews
Verification
```

Business can:

- register
- claim entity
- update operational data
- submit verification
- see traveler interest

---

# 43. RESPONSIVE BUSINESS PORTAL

On mobile:

Use bottom navigation or compact navigation.

On desktop:

Use sidebar.

Do not force traveler navigation onto government/business users.

---

# 44. GLOBAL LOADING SYSTEM

Every async operation must have an intentional loading state.

Use:

### Skeleton

For page/data loading.

### Spinner

For short actions.

### Progress

For multi-stage operations.

Example:

```text
Importing government data
██████████░░░░ 72%
```

### AI Processing

Use contextual stages.

---

# 45. GLOBAL ERROR SYSTEM

Three levels.

## Inline

For field errors.

```text
Harga tidak valid.
```

## Component

For failed cards/sections.

```text
Data belum tersedia.
[Retry]
```

## Page

For complete page failure.

```text
Halaman tidak dapat dimuat.
[Coba Lagi]
```

Never expose stack traces to users.

---

# 46. OFFLINE / POOR NETWORK

Since tourism often happens in areas with poor connectivity, the UI must gracefully handle unstable network conditions.

Stage 1:

- cached basic shell
- retry
- optimistic local UI where safe
- clear connection state

PWA Stage 2:

- offline itinerary
- cached trip
- cached essential destination information
- offline-friendly navigation

---

# 47. MAP UX

Maps are important but must not dominate every screen.

Use map in:

- Search
- Destination
- Itinerary
- Government dashboard

Mobile search:

```text
List
Map
```

as a toggle.

Itinerary:

Map is contextual.

Destination:

Map is secondary information.

---

# 48. IMAGE SYSTEM

Tourism is visual.

Primary content should use high-quality photography.

Image rules:

- consistent aspect ratio
- lazy loading
- responsive images
- placeholder/skeleton
- fallback image
- alt text
- avoid huge unoptimized images

Cards should never break when an image is unavailable.

---

# 49. CARD SYSTEM

Destination Card:

```text
PHOTO
♡
Name
Category
Rating
Distance
Open status
```

Business Card:

```text
PHOTO
Name
Category
Rating
Verified
Distance
```

Event Card:

```text
PHOTO
Event name
Date
Location
```

UMKM Card:

```text
PHOTO
Business name
Category
Rating
Distance
```

---

# 50. AI VISUAL LANGUAGE

AI should have a distinct but restrained visual identity.

Use:

```text
✨ AI Trip Planner
✨ Recommended for you
```

Avoid making every AI-related component flashy.

AI should feel:

> helpful, intelligent, trustworthy

not:

> gimmicky.

---

# 51. MOBILE INTERACTION RULES

Minimum touch target:

```text
44px+
```

Important actions must be reachable by thumb.

Avoid tiny icon-only actions without labels when the meaning is ambiguous.

Use bottom sheets for filters and contextual actions.

Use full-screen pages for major workflows.

---

# 52. NAVIGATION RULES

Traveler:

```text
Home
Search
Trips
Saved
Profile
```

Government:

```text
Dashboard
Destinations
UMKM
Events
Reports
Analytics
```

Business:

```text
Dashboard
Profile
Products
Statistics
Verification
```

Different roles should not inherit the same navigation model.

---

# 53. ACCESSIBILITY

Minimum:

- semantic HTML
- keyboard navigation
- screen-reader labels
- sufficient contrast
- visible focus
- alt text
- form labels
- error messages connected to fields
- touch-friendly controls

Accessibility is a platform requirement, not a later enhancement.

---

# 54. SEO

Because Stage 1 is web-first, public traveler pages should be SEO-ready.

Especially:

- destination
- city
- tourism area
- business
- event
- desa wisata

Each public page should have:

- semantic title
- description
- canonical URL
- structured metadata where appropriate
- share preview
- crawlable content

---

# 55. URL STRUCTURE

Conceptually:

```text
/
 /explore
 /destinations
 /destinations/{slug}
 /businesses/{slug}
 /events/{slug}
 /cities/{slug}
 /trips
 /trip-planner
 /saved
 /profile
```

Government:

```text
/government
/government/destinations
/government/umkm
/government/events
/government/reports
/government/analytics
```

Business:

```text
/business
/business/profile
/business/products
/business/statistics
/business/verification
```

Exact routing implementation may differ, but public resource identity should remain stable.

---

# 56. DESIGN SYSTEM COMPONENT TREE

```text
UI
│
├── Layout
│   ├── Header
│   ├── BottomNavigation
│   ├── Sidebar
│   └── Footer
│
├── Navigation
│   ├── Tabs
│   ├── Breadcrumb
│   └── Pagination
│
├── Input
│   ├── Search
│   ├── Select
│   ├── DatePicker
│   ├── Slider
│   └── TextArea
│
├── Cards
│   ├── DestinationCard
│   ├── BusinessCard
│   ├── EventCard
│   ├── UMKMCard
│   └── TripCard
│
├── Tourism
│   ├── Rating
│   ├── VerifiedBadge
│   ├── OpenStatus
│   ├── Distance
│   └── MapPreview
│
├── AI
│   ├── AIPlanner
│   ├── AIProgress
│   ├── Recommendation
│   └── Itinerary
│
└── Feedback
    ├── ReportForm
    ├── SuccessState
    └── ErrorState
```

---

# 57. FRONTEND ARCHITECTURE RULE

UI must not contain domain logic.

Bad:

```text
Component
  ↓
calculateTrust()
  ↓
database assumption
```

Correct:

```text
Component
   ↓
API Client
   ↓
API
   ↓
Core / Domain
```

Shared business rules belong in:

```text
packages/core
```

---

# 58. API CLIENT RULE

Web application must use:

```text
packages/api-client
```

for API access.

Avoid:

```text
fetch()
fetch()
fetch()
```

scattered throughout components.

---

# 59. STATE MODEL

Every major screen should consider:

```text
INITIAL
LOADING
SUCCESS
EMPTY
ERROR
```

For mutation:

```text
IDLE
SUBMITTING
SUCCESS
ERROR
```

For AI:

```text
IDLE
UNDERSTANDING
RETRIEVING
RANKING
COMPOSING
SUCCESS
ERROR
```

---

# 60. DATA DISPLAY RULE

The UI must distinguish:

### Canonical data

Data retrieved from platform.

### Generated content

AI-created explanation/recommendation.

### User signal

Traveler/business submitted information.

Example:

```text
Candi Prambanan
✓ Verified information
Updated 2 days ago

Recommended because:
You like cultural destinations
```

The first is factual.

The second is generated reasoning.

They must never visually imply the same authority.

---

# 61. FIRST MVP SCREEN PRIORITY

Do not build every screen simultaneously.

Priority:

```text
1. Home
2. Search
3. Destination Detail
4. AI Trip Planner
5. Itinerary
6. Feedback
```

Then:

```text
7. Profile
8. Saved
9. Trips
10. Government Dashboard
11. Business Portal
```

---

# 62. FIRST USABLE FLOW

The first clickable prototype should complete:

```text
HOME
 ↓
SEARCH
 ↓
DESTINATION
 ↓
ADD TO TRIP
 ↓
AI PLANNER
 ↓
ITINERARY
 ↓
REPORT
```

If this flow feels excellent on a 390px mobile viewport, the foundation is strong.

---

# 63. VISUAL REFERENCE DIRECTION

The UI should visually resemble the latest master concept board:

```text
┌───────────────────────────────────────┐
│ Indonesia Tourism Platform            │
│                                       │
│  Mobile Traveler Journey              │
│                                       │
│ [Home] [Search] [Detail] [AI] [Trip] │
│                                       │
├───────────────────────────────────────┤
│                                       │
│        Tourism Data + AI              │
│                                       │
│ Government → Data → Trust → AI        │
│                                       │
├───────────────────────────────────────┤
│ Government Dashboard                  │
│                                       │
├───────────────────────────────────────┤
│ Business / UMKM Portal                │
│                                       │
├───────────────────────────────────────┤
│ Product Roadmap                       │
│ Web → PWA → Native                    │
└───────────────────────────────────────┘
```

The visual language should communicate:

> **One Platform. Endless Indonesian Experiences.**

---

# 64. IMPLEMENTATION HANDOFF

This document becomes the UI/UX source of truth for Stage 1.

Lovable/Claude should use it to implement:

```text
apps/web
│
├── traveler
│   ├── home
│   ├── search
│   ├── destination
│   ├── business
│   ├── events
│   ├── trip-planner
│   ├── itinerary
│   ├── saved
│   ├── trips
│   └── feedback
│
├── government
│   ├── dashboard
│   ├── destinations
│   ├── umkm
│   ├── events
│   ├── reports
│   └── analytics
│
└── business
    ├── dashboard
    ├── profile
    ├── products
    ├── statistics
    └── verification
```

---

# 65. IMPLEMENTATION ORDER

The actual frontend implementation should follow:

```text
01
Design Tokens
        ↓
02
Global Components
        ↓
03
App Shell / Navigation
        ↓
04
Home
        ↓
05
Search
        ↓
06
Destination Detail
        ↓
07
AI Planner
        ↓
08
Itinerary
        ↓
09
Feedback
        ↓
10
Trips / Saved / Profile
        ↓
11
Government Dashboard
        ↓
12
Business Portal
```

---

# 66. FINAL UI/UX GUARDRAIL

The platform must never feel like six unrelated products.

It must feel like:

```text
                    INDONESIA
                  TOURISM PLATFORM
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     TRAVELER        GOVERNMENT        BUSINESS
        │                │                │
     Discover        Intelligence      Visibility
     Explore         Data              Growth
     Plan            Analytics         Operations
     Experience      Policy            Future Commerce
        │                │                │
        └────────────────┼────────────────┘
                         │
                    TOURISM DATA
                         │
                    TRUST + AI
                         │
                INDONESIA TOURISM OS
```

The traveler experience is the front door.

Government creates authoritative data.

Business creates operational supply.

Traveler creates demand and feedback.

The platform connects all three.

---

# 67. NORTH STAR UX

The entire Stage 1 experience should ultimately make this journey feel effortless:

> **"Saya ingin pergi ke suatu tempat."**

↓

> **"Saya menemukan tempat yang cocok."**

↓

> **"Saya percaya informasinya."**

↓

> **"AI membantu merencanakannya."**

↓

> **"Saya menjalani perjalanan."**

↓

> **"Saya memberikan feedback."**

↓

> **"Platform menjadi semakin pintar."**

That is the core UX loop of Indonesia Tourism Platform.