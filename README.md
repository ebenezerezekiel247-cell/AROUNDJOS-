# AroundJos 🌍

> **Discover Everything Around Jos** — The #1 local business discovery platform for Jos, Plateau State, Nigeria.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/aroundjos)

---

## Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Framework   | Next.js 15 (App Router)       |
| Language    | TypeScript                    |
| Styling     | Tailwind CSS                  |
| Database    | Supabase (PostgreSQL + RLS)   |
| Auth        | Supabase Auth (Email + Google)|
| Images      | Cloudinary                    |
| Maps        | Mapbox GL JS                  |
| Deployment  | Vercel                        |

---

## Features

- 🔍 **Discovery** — Search by keyword, category, area, rating
- 🗺️ **Interactive Map** — All businesses on a Mapbox map with markers
- ⭐ **Reviews** — Anonymous star ratings and written reviews
- 🔐 **Auth** — Email/password + Google OAuth via Supabase
- 🏢 **Business Claims** — Owners claim and manage listings
- 📱 **Mobile-first** — Sticky bottom nav, swipe-friendly cards
- 🌙 **Dark Mode** — Full light/dark theme support
- 👑 **Admin Panel** — Approve listings, moderate reviews, manage claims
- 📊 **Owner Dashboard** — Analytics placeholder, photo uploads, review replies
- 🎯 **Sponsored Listings** — Monetisation via featured and sponsored slots

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-username/aroundjos.git
cd aroundjos
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run both migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`
3. Go to **Authentication → Providers** and enable **Google**
4. Copy your project URL and keys

### 3. Set up Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy your **Cloud Name**, **API Key**, and **API Secret** from the dashboard

### 4. Set up Mapbox

1. Create an account at [mapbox.com](https://mapbox.com)
2. Create a public access token

### 5. Configure environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 6. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel

### Option A — Vercel CLI (recommended)

```bash
npm i -g vercel
vercel
# Follow prompts, then add env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
vercel env add NEXT_PUBLIC_BASE_URL   # your production URL
vercel --prod
```

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. Add all environment variables from `.env.example`
4. Deploy

### Option C — One-click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/aroundjos)

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── listing/[slug]/     # Listing detail
│   ├── category/[slug]/    # Category page
│   ├── area/[slug]/        # Area page
│   ├── search/             # Search + filters
│   ├── map/                # Interactive map
│   ├── auth/               # Sign in / Sign up
│   ├── add-listing/        # Multi-step add form
│   ├── dashboard/          # Owner dashboard
│   ├── admin/              # Admin panel
│   └── api/
│       └── upload/         # Cloudinary upload route
├── components/
│   ├── ui/                 # Button, Badge, Input, etc.
│   ├── layout/             # Header, BottomNav
│   ├── listings/           # ListingCard, AreaCard, etc.
│   ├── reviews/            # ReviewSection
│   └── search/             # HeroSearch
├── hooks/                  # useAuth, useListings, useUpload
├── lib/
│   ├── supabase/           # client.ts, server.ts, auth.ts
│   └── cloudinary/         # index.ts (upload utilities)
├── services/               # listings.ts, reviews.ts, claims.ts
├── types/                  # database.ts, index.ts
├── utils/                  # cn(), formatters, helpers
└── data/                   # seed.ts (static placeholder data)
supabase/
└── migrations/
    ├── 001_initial_schema.sql   # All tables, RLS, triggers
    └── 002_seed_data.sql        # Categories + sample listings
```

---

## Making the First Admin

After your first sign-up, promote yourself to admin via the Supabase dashboard:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'your@email.com';
```

---

## Generating Fresh Supabase Types

```bash
npm run supabase:types
```

---

## Environment Variables Reference

| Variable                          | Required | Description                          |
|-----------------------------------|----------|--------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`        | ✅       | Supabase project URL                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | ✅       | Supabase anon/public key             |
| `SUPABASE_SERVICE_ROLE_KEY`       | ✅       | Supabase service role (server-only)  |
| `CLOUDINARY_CLOUD_NAME`           | ✅       | Cloudinary cloud name                |
| `CLOUDINARY_API_KEY`              | ✅       | Cloudinary API key                   |
| `CLOUDINARY_API_SECRET`           | ✅       | Cloudinary secret (server-only)      |
| `NEXT_PUBLIC_MAPBOX_TOKEN`        | ✅       | Mapbox public access token           |
| `NEXT_PUBLIC_BASE_URL`            | ✅       | Your production domain               |

---

## Roadmap

- [ ] Supabase Realtime notifications
- [ ] Full-text search via `pg_trgm` upgrade
- [ ] Paystack payment integration for ads
- [ ] WhatsApp click tracking analytics
- [ ] Business owner verified badge system
- [ ] PWA / offline support
- [ ] iOS & Android wrapper (Capacitor)

---

## License

MIT — Built with ❤️ for Jos, Plateau State, Nigeria.
