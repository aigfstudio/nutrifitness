import { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { HeroSlider } from '@/components/HeroSlider'
import { ProductCard } from '@/components/ProductCard'
import type { Banner, Category, Product } from '@/lib/types'
import { Dumbbell, Zap, Flame, Milk, Scale, Leaf, TrendingUp, Cookie, LeafyGreen, Fish, RotateCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'NutriFitness.ch — Premium Swiss Supplements',
  description:
    'Premium Swiss nutrition and fitness supplements. Keto, protein, pre-workout and more. Free shipping over CHF 75.',
}

export const revalidate = 60

// Exact category values from the DB (from CSV import)
const HARDCODED_CATEGORIES = [
  { id: '1', name: 'Proteins',          slug: 'Proteins',          icon: <Dumbbell size={24} /> },
  { id: '2', name: 'Pre Workout',       slug: 'Pre Workout',       icon: <Zap size={24} /> },
  { id: '3', name: 'Creatine',          slug: 'CREATINE',          icon: <Flame size={24} /> },
  { id: '4', name: 'Whey / Isolate',    slug: 'WHEY/ISOLATE',      icon: <Milk size={24} /> },
  { id: '5', name: 'Weight Loss',       slug: 'Weight Loss',       icon: <Scale size={24} /> },
  { id: '6', name: 'Vitamins',          slug: 'Vitamins & Minerals', icon: <Leaf size={24} /> },
  { id: '7', name: 'Mass Gainer',       slug: 'Mass Gainer',       icon: <TrendingUp size={24} /> },
  { id: '8', name: 'Snacks',            slug: 'SNACKS',            icon: <Cookie size={24} /> },
  { id: '9', name: 'Ashwagandha',       slug: 'ASHWAGANDHA',       icon: <LeafyGreen size={24} /> },
  { id: '10', name: 'Omega 3',          slug: 'OMEGA 3',           icon: <Fish size={24} /> },
  { id: '11', name: 'Post Workout',     slug: 'Post Workout',      icon: <RotateCw size={24} /> },
  { id: '12', name: 'Energy & Recovery', slug: 'ÉNERGIE - RÉCUPÉRATION', icon: <Zap size={24} /> },
]

async function getData() {
  try {
    const supabase = createServerSupabaseClient()

    const [featuredResult, newResult] = await Promise.all([
      supabase.from('products').select('*').eq('is_featured', true).limit(8),
      supabase.from('products').select('*').eq('is_new', true).limit(4),
    ])

    let featured = (featuredResult.data ?? []) as Product[]
    if (featured.length === 0) {
      const fallback = await supabase.from('products').select('*').limit(8)
      featured = (fallback.data ?? []) as Product[]
    }

    let newProducts = (newResult.data ?? []) as Product[]
    if (newProducts.length === 0) {
      const fallback = await supabase.from('products').select('*').range(8, 11)
      newProducts = (fallback.data ?? []) as Product[]
    }

    return { featured, newProducts }
  } catch (error) {
    console.error('SERVER FETCH ERROR IN app/page.tsx:', error)
    return { featured: [], newProducts: [] }
  }
}

export default async function HomePage() {
  const { featured, newProducts } = await getData()

  return (
    <div className="page-transition bg-white">

      {/* ── Category Pills Strip ── */}
      <section className="bg-white border-b border-gray-100 py-5 px-4 overflow-x-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-2 min-w-max mx-auto justify-center flex-wrap">
            {HARDCODED_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-gray-200 hover:border-[#c8102e] hover:text-[#c8102e] text-xs font-black tracking-widest text-dark bg-white transition-all uppercase rounded-sm hover:bg-red-50 whitespace-nowrap"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hero Banner ── */}
      <HeroSlider />

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="bg-white py-12 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs font-bold tracking-[3px] text-gray-400 uppercase mb-2">Top Picks</div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-dark tracking-wide uppercase">
                  BRANDS ON SALE
                </h2>
                <div className="w-16 h-1 bg-[#c8102e] mt-2" />
              </div>
              <Link
                href="/products"
                className="text-[#c8102e] text-sm font-bold hover:underline flex items-center gap-1 group"
              >
                View All <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 5} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Category Grid Section ── */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display font-black text-4xl text-dark tracking-wide uppercase">SHOP BY CATEGORY</h2>
            <div className="w-16 h-1 bg-[#c8102e] mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {HARDCODED_CATEGORIES.slice(0, 12).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group flex flex-col items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-[#c8102e] p-5 rounded-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-3xl">{cat.icon}</div>
                <div className="text-[11px] font-black tracking-widest text-dark uppercase text-center group-hover:text-[#c8102e] transition-colors leading-tight">
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRO Membership Banner ── */}
      <section className="bg-[#111] py-12 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-gray-500 text-xs font-bold tracking-[3px] uppercase mb-3">Exclusive Membership</div>
            <h2 className="font-display text-5xl text-white mb-3 leading-none">
              NUTRIFIT <span className="text-[#c8102e]">PRO ACCESS</span>
            </h2>
            <p className="text-gray-400 text-sm">BOGO deals · Cash back rewards · Free shipping & more</p>
          </div>
          <div className="w-full md:w-auto md:min-w-[320px]">
            <div className="inline-block bg-[#c8102e] text-white text-[10px] font-bold tracking-[2px] px-3 py-1.5 mb-4 uppercase">
              IT PAYS TO GO PRO
            </div>
            <ul className="space-y-2 mb-6">
              {[
                'BOGO 50% Off 1st–7th every month',
                '15% Cash Back with Pick-A-Day offers',
                '10% Cash Back on every purchase',
                'FREE shipping on every order',
              ].map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-[#c8102e] font-bold">✓</span> {perk}
                </li>
              ))}
            </ul>
            <Link
              href="/account"
              className="block text-center bg-white text-dark px-8 py-3.5 text-sm font-bold tracking-wider hover:bg-gray-100 transition-colors"
            >
              ADD PRO ACCESS — CHF 39.99
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      {newProducts.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="inline-block bg-[#c8102e] text-white text-[10px] font-bold tracking-[2px] px-2 py-1 mb-2 uppercase">NEW</div>
                <h2 className="font-display text-4xl text-dark tracking-wide">NEW ON THE DROP</h2>
              </div>
              <Link href="/products?new=true" className="text-[#c8102e] text-sm font-bold hover:underline flex items-center gap-1 group">
                View All <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
