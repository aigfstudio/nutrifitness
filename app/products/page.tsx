import { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductsListUI } from '@/components/ProductsListUI'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse all NutriFitness.ch supplements — protein, pre-workout, keto, vitamins and more.',
}

export const revalidate = 60

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
    min_price?: string
    max_price?: string
    badge?: string
    sale?: string
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
  if (searchParams.min_price) query = query.gte('price', Number(searchParams.min_price))
  if (searchParams.max_price) query = query.lte('price', Number(searchParams.max_price))
  if (searchParams.badge === 'sale' || searchParams.sale === 'true') {
    query = query.not('price_original', 'is', null)
  }

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

  let activeCategoryLabel = 'All Products'
  if (activeCategory) {
    activeCategoryLabel = (SHOP_CATEGORIES.find((c) => c.slug === activeCategory)?.name ?? activeCategory)
  } else if (searchParams.badge === 'sale' || searchParams.sale === 'true') {
    activeCategoryLabel = 'Sale & Deals'
  } else if (searchParams.new === 'true') {
    activeCategoryLabel = 'New Arrivals'
  }

  // Build plain searchParams object for passing to client component
  const spObj: Record<string, string> = {}
  if (searchParams.category) spObj.category = searchParams.category
  if (searchParams.q) spObj.q = searchParams.q
  if (searchParams.page) spObj.page = searchParams.page
  if (searchParams.min_price) spObj.min_price = searchParams.min_price
  if (searchParams.max_price) spObj.max_price = searchParams.max_price

  return (
    <ProductsListUI
      products={products}
      totalCount={totalCount}
      totalPages={totalPages}
      page={page}
      activeCategory={activeCategory}
      activeCategoryLabel={activeCategoryLabel}
      searchQuery={searchQuery}
      sort={sort}
      spObj={spObj}
      searchParams={searchParams}
      categories={SHOP_CATEGORIES}
    />
  )
}
