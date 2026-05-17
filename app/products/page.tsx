import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import type { Product, Category } from '@/lib/types'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse all NutriFitness.ch supplements — protein, pre-workout, keto, vitamins and more.',
}

export const revalidate = 60

interface PageProps {
  searchParams: {
    category?: string
    q?: string
    new?: string
    badge?: string
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
  const perPage = 12
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase.from('products').select('*', { count: 'exact' })

  if (searchParams.category) query = query.ilike('category', `%${searchParams.category}%`)
  if (searchParams.q) query = query.ilike('name', `%${searchParams.q}%`)
  if (searchParams.new === 'true') query = query.eq('is_new', true)
  if (searchParams.brand) query = query.ilike('brand', `%${searchParams.brand}%`)
  if (searchParams.min_price) query = query.gte('price', Number(searchParams.min_price))
  if (searchParams.max_price) query = query.lte('price', Number(searchParams.max_price))

  let data: any[] | null = []
  let count: number | null = 0
  let categories: any[] | null = []
  const sort = searchParams.sort ?? 'featured'

  try {
    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    else if (sort === 'newest') query = query.order('created_at', { ascending: false })
    else if (sort === 'rating') query = query.order('rating', { ascending: false })
    else query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })

    const res = await query.range(from, to)
    data = res.data
    count = res.count

    const catRes = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    categories = catRes.data
  } catch (err) {
    console.error('SERVER FETCH ERROR IN app/products/page.tsx:', err)
  }

  const products = (data ?? []) as Product[]
  const cats = (categories ?? []) as Category[]
  const totalCount = count ?? 0
  const totalPages = Math.ceil(totalCount / perPage)

  const activeCategory = searchParams.category
  const activeSort = sort
  const searchQuery = searchParams.q

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 page-transition">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-primary transition-colors">Home</a>
        {' '}›{' '}
        <span className="text-dark font-semibold">
          {activeCategory ? cats.find(c => c.slug === activeCategory)?.name ?? activeCategory : 'All Products'}
        </span>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <ProductFilters
            categories={cats}
            activeCategory={activeCategory}
            activeSort={activeSort}
            searchQuery={searchQuery}
          />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="font-display text-3xl text-dark tracking-wide">
              {searchQuery
                ? `SEARCH: "${searchQuery}"`
                : activeCategory
                ? (cats.find(c => c.slug === activeCategory)?.name ?? activeCategory).toUpperCase()
                : 'ALL PRODUCTS'}
              <span className="text-base font-body font-normal text-gray-400 ml-2">
                ({totalCount} Results)
              </span>
            </h1>

            {/* Sort */}
            <form>
              {Object.entries(searchParams).filter(([k]) => k !== 'sort').map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v as string} />
              ))}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort By:</span>
                <select
                  name="sort"
                  defaultValue={activeSort}
                  onChange={(e) => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('sort', e.target.value)
                    window.location.href = url.toString()
                  }}
                  className="border border-gray-border px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                >
                  <option value="featured">Top Sellers</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </form>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="text-center py-24 bg-gray-50/50 rounded-xl border border-gray-border/60">
              <div className="text-6xl mb-6 opacity-30">🔍</div>
              <h2 className="font-display text-3xl text-dark mb-2 tracking-wider">NO PRODUCTS FOUND</h2>
              <p className="text-gray-400 text-sm mb-8">Try adjusting your filters or search term.</p>
              <a href="/products" className="bg-primary text-white px-8 py-3.5 text-sm font-bold tracking-wider hover:bg-primary-dark transition-all duration-300 shadow-glow hover:shadow-glow-hover hover:-translate-y-0.5 inline-block rounded-sm">
                VIEW ALL PRODUCTS
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 4} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-1.5 pb-8">
                  {page > 1 && (
                    <a
                      href={`?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}
                      className="w-9 h-9 border border-gray-border flex items-center justify-center text-sm hover:border-dark transition-colors"
                    >
                      ←
                    </a>
                  )}
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                      className={`w-9 h-9 border flex items-center justify-center text-sm font-semibold transition-colors ${
                        p === page
                          ? 'bg-dark text-white border-dark'
                          : 'border-gray-border hover:border-dark'
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                  {page < totalPages && (
                    <a
                      href={`?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}
                      className="w-9 h-9 border border-gray-border flex items-center justify-center text-sm hover:border-dark transition-colors"
                    >
                      →
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
