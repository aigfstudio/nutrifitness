import { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse all NutriFitness.ch supplements — protein, pre-workout, keto, vitamins and more.',
}

export const revalidate = 60

// Exact category values matching the products.category column
const SHOP_CATEGORIES = [
  { name: 'All Products',         slug: '' },
  { name: 'Proteins',             slug: 'Proteins' },
  { name: 'Whey / Isolate',       slug: 'WHEY/ISOLATE' },
  { name: 'Pre Workout',          slug: 'Pre Workout' },
  { name: 'Creatine',             slug: 'CREATINE' },
  { name: 'Mass Gainer',          slug: 'Mass Gainer' },
  { name: 'Weight Loss',          slug: 'Weight Loss' },
  { name: 'Vitamins & Minerals',  slug: 'Vitamins & Minerals' },
  { name: 'Omega 3',              slug: 'OMEGA 3' },
  { name: 'Ashwagandha',          slug: 'ASHWAGANDHA' },
  { name: 'Post Workout',         slug: 'Post Workout' },
  { name: 'Intra Workout',        slug: 'Intra Workout' },
  { name: 'Snacks',               slug: 'SNACKS' },
  { name: 'Gainers',              slug: 'GAINERS' },
  { name: 'Energy & Recovery',    slug: 'ÉNERGIE - RÉCUPÉRATION' },
  { name: 'Antioxidants',         slug: 'ANTIOXYDANTS' },
  { name: 'Magnesium',            slug: 'MAGNÉSIUM' },
  { name: 'Sleep Aid',            slug: 'SOMMEIL' },
  { name: 'Accessories',          slug: 'Accessories' },
  { name: 'Best Sellers',         slug: 'Best Sellers' },
]

interface PageProps {
  searchParams: {
    category?: string
    q?: string
    new?: string
    sort?: string
    page?: string
    brand?: string
    min_price?: string
    max_price?: string
  }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const supabase = createServerSupabaseClient()
  const page = Number(searchParams.page ?? 1)
  const perPage = 24
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase.from('products').select('*', { count: 'exact' })

  if (searchParams.category) query = query.ilike('category', searchParams.category)
  if (searchParams.q) query = query.ilike('name', `%${searchParams.q}%`)
  if (searchParams.new === 'true') query = query.eq('is_new', true)
  if (searchParams.brand) query = query.ilike('brand', `%${searchParams.brand}%`)
  if (searchParams.min_price) query = query.gte('price', Number(searchParams.min_price))
  if (searchParams.max_price) query = query.lte('price', Number(searchParams.max_price))

  // Apply sorting
  const sort = searchParams.sort ?? 'featured'
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'rating') query = query.order('rating', { ascending: false })

  let data: any[] | null = []
  let count: number | null = 0

  try {
    const res = await query.range(from, to)
    data = res.data
    count = res.count
  } catch (err) {
    console.error('PRODUCTS PAGE FETCH ERROR:', err)
  }

  const products = (data ?? []) as Product[]
  const totalCount = count ?? 0
  const totalPages = Math.ceil(totalCount / perPage)
  const activeCategory = searchParams.category ?? ''
  const searchQuery = searchParams.q ?? ''

  const activeCategoryLabel = (SHOP_CATEGORIES.find(c => c.slug === activeCategory)?.name ?? activeCategory) || 'All Products'

  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-[#c8102e]">Home</Link>
            {' '}›{' '}
            <span className="text-dark font-semibold">{activeCategoryLabel}</span>
          </div>
          <h1 className="font-display text-3xl text-dark tracking-wide">
            {searchQuery ? `SEARCH: "${searchQuery}"` : activeCategoryLabel.toUpperCase()}
            <span className="text-base font-body font-normal text-gray-400 ml-3">({totalCount} Results)</span>
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            {/* Categories */}
            <div className="mb-6">
              <div className="text-xs font-black tracking-widest text-dark uppercase mb-3 pb-2 border-b-2 border-[#c8102e]">
                CATEGORIES
              </div>
              <div className="space-y-0.5">
                {SHOP_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug ? `/products?category=${encodeURIComponent(cat.slug)}` : '/products'}
                    className={`block px-3 py-2 text-sm transition-colors rounded-sm ${
                      activeCategory === cat.slug
                        ? 'bg-[#c8102e] text-white font-bold'
                        : 'text-gray-600 hover:text-[#c8102e] hover:bg-red-50'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div className="mb-6">
              <div className="text-xs font-black tracking-widest text-dark uppercase mb-3 pb-2 border-b-2 border-[#c8102e]">
                PRICE
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Under CHF 20', min: '', max: '20' },
                  { label: 'CHF 20 – 40',  min: '20', max: '40' },
                  { label: 'CHF 40 – 70',  min: '40', max: '70' },
                  { label: 'CHF 70 – 100', min: '70', max: '100' },
                  { label: 'Over CHF 100', min: '100', max: '' },
                ].map((r) => {
                  const params = new URLSearchParams()
                  if (activeCategory) params.set('category', activeCategory)
                  if (r.min) params.set('min_price', r.min)
                  if (r.max) params.set('max_price', r.max)
                  const isActive =
                    searchParams.min_price === r.min && searchParams.max_price === r.max
                  return (
                    <Link
                      key={r.label}
                      href={`/products?${params}`}
                      className={`block px-3 py-2 text-sm transition-colors rounded-sm ${
                        isActive ? 'bg-[#c8102e] text-white font-bold' : 'text-gray-600 hover:text-[#c8102e] hover:bg-red-50'
                      }`}
                    >
                      {r.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* ── Main grid ── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              {/* Mobile categories dropdown */}
              <div className="lg:hidden">
                <select
                  onChange={(e) => {
                    if (typeof window !== 'undefined') {
                      window.location.href = e.target.value
                        ? `/products?category=${encodeURIComponent(e.target.value)}`
                        : '/products'
                    }
                  }}
                  value={activeCategory}
                  className="border border-gray-300 px-3 py-2 text-sm focus:outline-none bg-white rounded-sm"
                >
                  {SHOP_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500">Sort By:</span>
                <select
                  defaultValue={sort}
                  onChange={(e) => {
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href)
                      url.searchParams.set('sort', e.target.value)
                      window.location.href = url.toString()
                    }
                  }}
                  className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-dark bg-white rounded-sm"
                >
                  <option value="featured">Top Sellers</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            {products.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 border border-gray-100">
                <div className="text-6xl mb-6 opacity-30">🔍</div>
                <h2 className="font-display text-3xl text-dark mb-2 tracking-wider">NO PRODUCTS FOUND</h2>
                <p className="text-gray-400 text-sm mb-8">Try adjusting your filters or search term.</p>
                <Link
                  href="/products"
                  className="bg-[#c8102e] text-white px-8 py-3.5 text-sm font-bold tracking-wider hover:bg-[#a50d28] transition-all inline-block"
                >
                  VIEW ALL PRODUCTS
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} priority={i < 4} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-1.5 pb-8 flex-wrap">
                    {page > 1 && (
                      <Link
                        href={`?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}
                        className="w-10 h-10 border border-gray-200 flex items-center justify-center text-sm hover:border-dark hover:bg-gray-50 transition-colors"
                      >
                        ←
                      </Link>
                    )}
                    {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                        className={`w-10 h-10 border flex items-center justify-center text-sm font-semibold transition-colors ${
                          p === page
                            ? 'bg-[#c8102e] text-white border-[#c8102e]'
                            : 'border-gray-200 hover:border-dark hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                    {page < totalPages && (
                      <Link
                        href={`?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}
                        className="w-10 h-10 border border-gray-200 flex items-center justify-center text-sm hover:border-dark hover:bg-gray-50 transition-colors"
                      >
                        →
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
