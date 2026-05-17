// ============================================================
// lib/supabase.ts
// ============================================================
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Product = {
  id: string
  sku: string
  name: string
  brand: string
  slug: string
  description: string
  category: string
  subcategory: string
  price: number
  price_original: number | null
  currency: string
  weight_g: number
  flavors: string[]
  images: string[]
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  rating: number
  review_count: number
  tags: string[]
}


// ============================================================
// app/layout.tsx
// ============================================================
import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'NutriFitness.ch — Swiss Performance Nutrition',
  description: 'Premium keto, protein and performance supplements delivered in Switzerland.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${dmSans.variable}`}>
      <body className="font-body bg-gray-50 text-gray-900">
        <Navbar />
        <main>{children}</main>
        <footer className="bg-dark text-gray-400 text-center text-xs py-4 mt-8 tracking-wide">
          © 2025 NutriFitness.ch — Premium Swiss Nutrition
        </footer>
      </body>
    </html>
  )
}


// ============================================================
// app/page.tsx  (Home — Server Component)
// ============================================================
import { supabase } from '@/lib/supabase'
import HeroSlider from '@/components/HeroSlider'
import CategoryBar from '@/components/CategoryBar'
import ProductGrid from '@/components/ProductGrid'

export const revalidate = 60 // ISR: refresh every 60 seconds

export default async function HomePage() {
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <>
      <HeroSlider />
      <CategoryBar />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-4xl tracking-wide">BEST SELLERS</h2>
          <a href="/products" className="text-primary text-xs font-semibold uppercase tracking-widest hover:underline">
            View All →
          </a>
        </div>
        <ProductGrid products={featuredProducts ?? []} />
      </section>
    </>
  )
}


// ============================================================
// components/Navbar.tsx  (Client Component)
// ============================================================
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [cartCount] = useState(0) // wire to cart store later

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-white text-center py-2 text-xs tracking-wider">
        🚀 FREE SHIPPING OVER CHF 79 · CODE: KETO20 FOR 20% OFF
      </div>

      {/* Main nav */}
      <nav className="bg-dark px-6 flex items-center gap-4 h-16 sticky top-0 z-50">
        <Link href="/" className="font-display text-3xl text-white tracking-wide shrink-0">
          {/* Replace with your actual logo once you add it */}
          NUTRI<span className="text-primary">FIT</span>
          {/* <Image src="/logo-white.png" alt="NutriFitness" width={160} height={40} priority /> */}
        </Link>

        {/* Search */}
        <div className="flex flex-1 max-w-xl bg-white rounded overflow-hidden">
          <input
            className="flex-1 px-4 py-2 text-sm outline-none"
            placeholder="Search protein, keto, vitamins…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="bg-primary text-white px-4 text-sm hover:bg-primary-dark transition">
            🔍
          </button>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-6">
          <Link href="/account" className="text-white text-xs uppercase tracking-wider hover:text-primary flex flex-col items-center gap-0.5">
            <span className="text-xl">👤</span>
            <span>Account</span>
          </Link>
          <Link href="/cart" className="text-white text-xs uppercase tracking-wider hover:text-primary flex flex-col items-center gap-0.5 relative">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
            <span>Cart</span>
          </Link>
        </div>
      </nav>

      {/* Category bar */}
      <div className="bg-[#1a1a1a] border-b-2 border-primary">
        <div className="max-w-7xl mx-auto flex px-4">
          {['Protein','Weight Loss','Vitamins','Keto','Pre-Workout','Women\'s','Deals'].map(cat => (
            <Link key={cat} href={`/products?category=${cat.toLowerCase()}`}
              className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white border-b-2 border-transparent hover:border-primary transition whitespace-nowrap">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}


// ============================================================
// components/ProductCard.tsx
// ============================================================
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/supabase'

export default function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
  const discount = product.price_original
    ? Math.round((1 - product.price / product.price_original) * 100)
    : null

  return (
    <Link href={`/products/${product.slug}`} className="group bg-white border border-gray-200 rounded hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={`/products/${product.images?.[0] ?? product.slug + '.jpg'}`}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={priority}
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
            -{discount}%
          </span>
        )}
        {product.is_new && !discount && (
          <span className="absolute top-2 left-2 bg-green-700 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
            New
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{product.brand}</p>
        <div className="text-yellow-400 text-xs my-0.5">
          {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          <span className="text-gray-400 ml-1">({product.review_count})</span>
        </div>
        <p className="text-sm font-semibold text-gray-900 mt-1 leading-tight line-clamp-2 flex-1">{product.name}</p>
        {product.flavors?.length > 0 && (
          <p className="text-[11px] text-gray-500 mt-1">{product.flavors[0]}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div>
            {product.price_original && (
              <span className="text-xs text-gray-400 line-through mr-1">
                {product.currency} {product.price_original.toFixed(2)}
              </span>
            )}
            <span className="text-base font-bold text-gray-900">
              {product.currency} {product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={e => { e.preventDefault(); /* add to cart */ }}
            className="bg-dark text-white w-8 h-8 rounded flex items-center justify-center text-sm hover:bg-primary transition font-bold"
            aria-label="Add to cart"
          >
            +
          </button>
        </div>
      </div>
    </Link>
  )
}


// ============================================================
// components/ProductGrid.tsx  (with client-side filter)
// ============================================================
'use client'
import { useState } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/supabase'

const FILTERS = ['All', 'Keto', 'Protein', 'Vitamins', 'Snacks', 'Pre-Workout']

export default function ProductGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? products
    : products.filter(p =>
        p.category?.toLowerCase() === active.toLowerCase() ||
        p.tags?.includes(active.toLowerCase())
      )

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-5">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActive(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
              active === f ? 'bg-dark text-white border-dark' : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} />
        ))}
      </div>
    </>
  )
}


// ============================================================
// components/HeroSlider.tsx  (Framer Motion)
// ============================================================
'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

const SLIDES = [
  {
    badge: 'New Drop 2025',
    headline: ['BUILD YOUR', 'BEST BODY'],
    accent: 'BEST BODY',
    sub: 'Premium Swiss nutrition. Keto, protein & performance supplements.',
    cta: 'Shop Now',
    ctaLink: '/products',
    bg: '#111'
  },
  {
    badge: 'Keto Collection',
    headline: ['KETO DONE', 'DELICIOUSLY'],
    accent: 'DELICIOUSLY',
    sub: 'Croissants, bars & snacks with only 2g net carbs.',
    cta: 'Shop Keto',
    ctaLink: '/products?category=keto',
    bg: '#1a1a1a'
  },
  {
    badge: 'Limited Deal',
    headline: ['BUY 1 GET 1', 'FREE PROTEIN'],
    accent: 'FREE PROTEIN',
    sub: 'Mix and match all whey flavours. This week only.',
    cta: 'Grab the Deal',
    ctaLink: '/products?category=protein',
    bg: '#0d0d0d'
  }
]

export default function HeroSlider() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[i]

  return (
    <div className="relative overflow-hidden bg-dark" style={{ minHeight: 320 }}>
      <AnimatePresence mode="wait">
        <motion.div key={i}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="px-10 py-16 max-w-3xl"
          style={{ background: slide.bg }}>
          <span className="inline-block bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 mb-4">{slide.badge}</span>
          <h1 className="font-display text-6xl text-white leading-none mb-4">
            {slide.headline.map((line, j) => (
              <span key={j} className={`block ${line === slide.accent ? 'text-primary' : ''}`}>{line}</span>
            ))}
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mb-6">{slide.sub}</p>
          <Link href={slide.ctaLink}
            className="inline-block bg-primary text-white px-7 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-primary-dark transition rounded-sm">
            {slide.cta}
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-10 flex gap-2">
        {SLIDES.map((_, j) => (
          <button key={j} onClick={() => setI(j)}
            className={`w-2 h-2 rounded-full transition ${j === i ? 'bg-primary w-6' : 'bg-gray-600'}`}
            aria-label={`Slide ${j + 1}`} />
        ))}
      </div>
    </div>
  )
}


// ============================================================
// app/account/login/page.tsx  (UI only — not connected yet)
// ============================================================
'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-md shadow-sm">
        <h1 className="font-display text-4xl text-center mb-6 tracking-wide">
          {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </h1>

        <div className="flex mb-6 border border-gray-200 rounded overflow-hidden">
          <button onClick={() => setMode('login')} className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition ${mode === 'login' ? 'bg-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Sign In</button>
          <button onClick={() => setMode('register')} className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition ${mode === 'register' ? 'bg-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Register</button>
        </div>

        <div className="space-y-3">
          {mode === 'register' && (
            <input className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:border-primary focus:outline-none"
              placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          )}
          <input className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:border-primary focus:outline-none"
            type="email" placeholder="Email Address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:border-primary focus:outline-none"
            type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>

        <button className="w-full bg-primary text-white py-3 rounded mt-5 text-sm font-semibold uppercase tracking-wider hover:bg-primary-dark transition">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          {mode === 'login' ? "Don't have an account? " : "Already registered? "}
          <button className="text-primary font-semibold" onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Register free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}


// ============================================================
// tailwind.config.js
// ============================================================
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#c8102e',
        'primary-dark': '#a00d26',
        dark: '#111111',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    }
  },
  plugins: [],
}


// ============================================================
// next.config.js
// ============================================================
/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    domains: ['your-supabase-id.supabase.co'], // add your Supabase storage domain
  },
}
