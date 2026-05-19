'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { ShopControls } from '@/components/ShopControls'
import type { Product } from '@/lib/types'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'

interface ProductsListUIProps {
  products: Product[]
  totalCount: number
  totalPages: number
  page: number
  activeCategory: string
  activeCategoryLabel: string
  searchQuery: string
  sort: string
  spObj: Record<string, string>
  searchParams: any
  categories: { name: string; slug: string }[]
}

export function ProductsListUI({
  products,
  totalCount,
  totalPages,
  page,
  activeCategory,
  activeCategoryLabel,
  searchQuery,
  sort,
  spObj,
  searchParams,
  categories,
}: ProductsListUIProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-[#c8102e]">{isMounted ? t.nav.home : 'Home'}</Link>
            {' '}›{' '}
            <span className="text-dark font-semibold">{activeCategoryLabel}</span>
          </div>
          <h1 className="font-display text-3xl text-dark tracking-wide">
            {searchQuery ? (isMounted ? t.productsList.searchPrefix.replace('{query}', searchQuery) : `SEARCH: "${searchQuery}"`) : activeCategoryLabel.toUpperCase()}
            <span className="text-base font-body font-normal text-gray-400 ml-3">
              {isMounted ? t.productsList.results.replace('{count}', String(totalCount)) : `(${totalCount} Results)`}
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="mb-6">
              <div className="text-xs font-black tracking-widest text-dark uppercase mb-3 pb-2 border-b-2 border-[#c8102e]">
                {isMounted ? t.productsList.categories : 'CATEGORIES'}
              </div>
              <div className="space-y-0.5">
                {categories.map((cat) => (
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
            <div>
              <div className="text-xs font-black tracking-widest text-dark uppercase mb-3 pb-2 border-b-2 border-[#c8102e]">
                {isMounted ? t.productsList.price : 'PRICE'}
              </div>
              <div className="space-y-0.5">
                {[
                  { label: isMounted ? t.productsList.under20 : 'Under CHF 20',  min: '',    max: '20'  },
                  { label: isMounted ? t.productsList.from20to40 : 'CHF 20 – 40',   min: '20',  max: '40'  },
                  { label: isMounted ? t.productsList.from40to70 : 'CHF 40 – 70',   min: '40',  max: '70'  },
                  { label: isMounted ? t.productsList.from70to100 : 'CHF 70 – 100',  min: '70',  max: '100' },
                  { label: isMounted ? t.productsList.over100 : 'Over CHF 100',  min: '100', max: ''    },
                ].map((r, idx) => {
                  const params = new URLSearchParams()
                  if (activeCategory) params.set('category', activeCategory)
                  if (r.min) params.set('min_price', r.min)
                  if (r.max) params.set('max_price', r.max)
                  const isActive =
                    (searchParams.min_price ?? '') === r.min &&
                    (searchParams.max_price ?? '') === r.max
                  return (
                    <Link
                      key={idx}
                      href={`/products?${params}`}
                      className={`block px-3 py-2 text-sm transition-colors rounded-sm ${
                        isActive
                          ? 'bg-[#c8102e] text-white font-bold'
                          : 'text-gray-600 hover:text-[#c8102e] hover:bg-red-50'
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
            <ShopControls
              sort={sort}
              activeCategory={activeCategory}
              categories={categories}
              searchParams={spObj}
            />

            {products.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 border border-gray-100">
                <div className="flex justify-center mb-6 text-gray-300 opacity-50"><Search size={72} strokeWidth={1} /></div>
                <h2 className="font-display text-3xl text-dark mb-2 tracking-wider">
                  {isMounted ? t.productsList.notFound : 'NO PRODUCTS FOUND'}
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  {isMounted ? t.productsList.adjustFilters : 'Try adjusting your filters or search term.'}
                </p>
                <Link
                  href="/products"
                  className="bg-[#c8102e] text-white px-8 py-3.5 text-sm font-bold tracking-wider hover:bg-[#a50d28] transition-all inline-block"
                >
                  {isMounted ? t.productsList.viewAllBtn : 'VIEW ALL PRODUCTS'}
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
                        href={`/products?${new URLSearchParams({ ...spObj, page: String(page - 1) })}`}
                        className="w-10 h-10 border border-gray-200 flex items-center justify-center text-sm hover:border-dark transition-colors"
                      >
                        ←
                      </Link>
                    )}
                    {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/products?${new URLSearchParams({ ...spObj, page: String(p) })}`}
                        className={`w-10 h-10 border flex items-center justify-center text-sm font-semibold transition-colors ${
                          p === page
                            ? 'bg-[#c8102e] text-white border-[#c8102e]'
                            : 'border-gray-200 hover:border-dark'
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                    {page < totalPages && (
                      <Link
                        href={`/products?${new URLSearchParams({ ...spObj, page: String(page + 1) })}`}
                        className="w-10 h-10 border border-gray-200 flex items-center justify-center text-sm hover:border-dark transition-colors"
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
