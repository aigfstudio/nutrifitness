import { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { HeroSlider } from '@/components/HeroSlider'
import { ProductCard } from '@/components/ProductCard'
import type { Banner, Category, Product } from '@/lib/types'

export const metadata: Metadata = {
  title: 'NutriFitness.ch — Premium Swiss Supplements',
  description:
    'Premium Swiss nutrition and fitness supplements. Keto, protein, pre-workout and more. Free shipping over CHF 79.',
}

export const revalidate = 60

async function getData() {
  const supabase = createServerSupabaseClient()
  const [bannersResult, categoriesResult, featuredResult, newResult] = await Promise.all([
    supabase.from('banners').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order').limit(12),
    supabase.from('products').select('*').eq('is_featured', true).eq('in_stock', true).order('sort_order').limit(8),
    supabase.from('products').select('*').eq('is_new', true).eq('in_stock', true).order('created_at', { ascending: false }).limit(4),
  ])
  return {
    banners: (bannersResult.data ?? []) as Banner[],
    categories: (categoriesResult.data ?? []) as Category[],
    featured: (featuredResult.data ?? []) as Product[],
    newProducts: (newResult.data ?? []) as Product[],
  }
}

export default async function HomePage() {
  const { banners, categories, featured, newProducts } = await getData()

  return (
    <div className="page-transition">
      {/* Hero Slider */}
      <HeroSlider banners={banners} />

      {/* Category Strip */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-gray-border py-8 px-4">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="font-display text-2xl text-dark mb-5 tracking-wide">SHOP BY CATEGORY</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-3 border border-gray-border hover:border-primary transition-colors text-center"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-black tracking-wider group-hover:scale-110 transition-transform"
                    style={{ background: cat.bg_color }}
                  >
                    {cat.abbr}
                  </div>
                  <span className="text-[11px] font-bold text-dark leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {featured.length > 0 && (
        <section className="bg-gray-light py-10 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-4xl text-dark tracking-wide">BEST SELLERS</h2>
              <Link href="/products" className="text-primary text-sm font-bold hover:text-primary-dark transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pro/Membership Banner */}
      <section className="bg-dark py-12 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-gray-500 text-xs font-bold tracking-[3px] uppercase mb-3">
              Exclusive Membership
            </div>
            <h2 className="font-display text-5xl text-white mb-3 leading-none">
              NUTRIFIT <span className="text-primary">PRO ACCESS</span>
            </h2>
            <p className="text-gray-400 text-sm">
              BOGO deals · Cash back rewards · Free shipping & more
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[320px]">
            <div className="inline-block bg-primary text-white text-[10px] font-bold tracking-[2px] px-3 py-1.5 mb-4 uppercase">
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
                  <span className="text-primary font-bold">✓</span> {perk}
                </li>
              ))}
            </ul>
            <button className="bg-white text-dark px-8 py-3.5 text-sm font-bold tracking-wider hover:bg-gray-light transition-colors">
              ADD PRO ACCESS — CHF 39.99
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-10 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-block bg-primary text-white text-[10px] font-bold tracking-[2px] px-2 py-1 mb-2">NEW</div>
                <h2 className="font-display text-4xl text-dark tracking-wide">NEW ON THE DROP</h2>
              </div>
              <Link href="/products?new=true" className="text-primary text-sm font-bold hover:text-primary-dark transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why NutriFitness */}
      <section className="bg-dark py-12 px-4">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-display text-4xl text-white mb-2">WHY NUTRIFITNESS?</h2>
          <p className="text-gray-400 text-sm mb-10">Swiss precision. Sports performance. Real results.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🇨🇭', title: 'Swiss Quality', text: 'Every product lab-tested and certified to the highest Swiss standards.' },
              { icon: '⚡', title: 'Performance Formulas', text: 'Clinically dosed ingredients. No proprietary blends. No compromises.' },
              { icon: '🚚', title: 'Fast Delivery', text: 'Free shipping over CHF 79. Most orders delivered within 2 working days.' },
            ].map((item) => (
              <div key={item.title} className="bg-dark-2 border border-dark-3 p-8 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display text-xl text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
