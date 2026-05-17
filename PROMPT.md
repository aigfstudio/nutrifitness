# NutriFitness.ch — MVP Rebuild Prompt
**Stack: Next.js 14 (App Router) · Supabase · Tailwind CSS · Vercel**

---

## PROJECT CONTEXT

Build a production-ready e-commerce storefront for **NutriFitness.ch**, a Swiss nutrition and fitness supplement store. The design should mirror **GNC.com** — bold, sports-performance aesthetic with:
- Black, dark-grey, and crimson red (`#c8102e`) color scheme
- Bebas Neue for display headings, DM Sans for body
- Product-first layout with prominent search and category filtering

This is an **MVP** to demonstrate the final product to clients. All UI must be pixel-perfect. Supabase integration is real for products — user accounts are UI only for now.

---

## TECH STACK

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS + custom fonts |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (UI wired, email/password) |
| Images | Next.js `<Image>` + Supabase Storage |
| Deploy | Vercel via GitHub |
| Animations | Framer Motion (hero slider, page transitions) |

---

## SUPABASE SCHEMA

Run these in your Supabase SQL editor:

```sql
-- Products table (matches your CSV upload)
create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  brand text,
  slug text unique not null,
  description text,
  category text,
  subcategory text,
  price numeric(10,2) not null,
  price_original numeric(10,2),
  currency text default 'CHF',
  weight_g integer,
  flavors text[],
  images text[],      -- filenames from your folder e.g. ['keto-croissant-1.jpg']
  in_stock boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  rating numeric(2,1) default 0,
  review_count integer default 0,
  tags text[],
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table products enable row level security;
create policy "Public read" on products for select using (true);

-- Profiles (for user accounts)
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Own profile" on profiles using (auth.uid() = id);

-- Orders (UI ready, connect later)
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  items jsonb,
  total numeric(10,2),
  status text default 'pending',
  shipping_address jsonb,
  created_at timestamptz default now()
);
```

---

## PROJECT STRUCTURE

```
nutrifitness/
├── app/
│   ├── layout.tsx          # Root layout: fonts, navbar, footer
│   ├── page.tsx            # Home: hero, categories, featured products
│   ├── products/
│   │   ├── page.tsx        # All products with filters
│   │   └── [slug]/page.tsx # Product detail page
│   ├── account/
│   │   ├── page.tsx        # Account dashboard (UI only)
│   │   └── login/page.tsx  # Sign in / Register
│   └── cart/page.tsx       # Cart (localStorage for MVP)
├── components/
│   ├── Navbar.tsx
│   ├── HeroSlider.tsx      # Framer Motion auto-sliding hero
│   ├── ProductGrid.tsx     # Fetches from Supabase
│   ├── ProductCard.tsx
│   ├── CategoryBar.tsx
│   └── CartDrawer.tsx
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── types.ts            # Product, Profile, Order types
├── public/
│   └── products/           # ← PASTE YOUR PRODUCT IMAGES HERE
│       ├── keto-croissant-50g.jpg
│       ├── whey-protein-vanilla-1kg.jpg
│       └── ...
└── .env.local
```

---

## ENVIRONMENT VARIABLES (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## IMAGE NAMING CONVENTION

Name your product images to match the `slug` field in your CSV:

```
public/products/
  {slug}.jpg          # main product image
  {slug}-2.jpg        # second image (optional)
  {slug}-3.jpg        # third image (optional)

logo:
  public/logo.png     # or logo.svg — used in navbar
  public/logo-white.png
```

---

## KEY COMPONENTS TO BUILD

### 1. Supabase Client (`lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 2. Fetch Products (Server Component)
```typescript
// In app/page.tsx or ProductGrid
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('is_featured', true)
  .order('created_at', { ascending: false })
  .limit(8)
```

### 3. Hero Slider — 3 slides with auto-advance every 5s
Slides array defined as static config, switches with Framer Motion AnimatePresence.

### 4. Product Filter (client component)
Category tabs + sort dropdown. Filters re-query Supabase with `.eq('category', filter)`.

### 5. Cart — localStorage (no backend for MVP)
```typescript
// Simple cart store using Zustand or React Context
const cart = JSON.parse(localStorage.getItem('nf_cart') || '[]')
```

---

## PERFORMANCE (Super Fast Images)

```typescript
// In ProductCard.tsx — always use next/image
import Image from 'next/image'

<Image
  src={`/products/${product.slug}.jpg`}
  alt={product.name}
  width={400}
  height={400}
  sizes="(max-width: 768px) 50vw, 25vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."  
  priority={index < 4}  // LCP priority for first 4 products
/>
```

Add to `next.config.js`:
```js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1200],
  }
}
```

---

## DESIGN TOKENS (tailwind.config.js)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#c8102e',    // NutriFit red
        'primary-dark': '#a00d26',
        dark: '#111111',
        'dark-2': '#1a1a1a',
        'dark-3': '#2a2a2a',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    }
  }
}
```

---

## DEPLOYMENT (GitHub → Vercel)

1. `git init` + push to GitHub repo `nutrifitness-mvp`
2. Connect repo to Vercel (vercel.com → Import Project)
3. Add env vars in Vercel dashboard
4. Every `git push` to `main` = auto-deploy ✅

---

## WHAT TO TELL YOUR AI ASSISTANT

Use this prompt when working with Cursor, v0, or Claude:

> "Build a Next.js 14 App Router e-commerce site for NutriFitness.ch using the schema and structure in PROMPT.md. Style it exactly like GNC.com — bold, sports performance aesthetic, black/red/white palette, Bebas Neue display font. Fetch products from Supabase. Use Next.js Image for all product photos. The hero section should have a 3-slide Framer Motion slider. Product grid should support category filtering with real Supabase queries. User accounts are UI-only — show login/register forms but don't connect to Supabase Auth yet. Cart uses localStorage. Deploy target is Vercel."
