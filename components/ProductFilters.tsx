'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { Category } from '@/lib/types'

interface ProductFiltersProps {
  categories: Category[]
  activeCategory?: string
  activeSort?: string
  searchQuery?: string
}

const PRICE_RANGES = [
  { label: 'Under CHF 20', min: 0, max: 20 },
  { label: 'CHF 20 – CHF 40', min: 20, max: 40 },
  { label: 'CHF 40 – CHF 60', min: 40, max: 60 },
  { label: 'Over CHF 60', min: 60, max: 9999 },
]

export function ProductFilters({ categories, activeCategory, searchQuery }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) current.delete(key)
        else current.set(key, value)
      })
      current.delete('page')
      return current.toString()
    },
    [searchParams]
  )

  const setCategory = (slug: string | null) => {
    router.push(pathname + '?' + createQueryString({ category: slug }))
  }

  const setPriceRange = (min: number | null, max: number | null) => {
    router.push(
      pathname + '?' + createQueryString({
        min_price: min !== null ? String(min) : null,
        max_price: max !== null && max < 9999 ? String(max) : null,
      })
    )
  }

  const currentMin = searchParams.get('min_price')
  const currentMax = searchParams.get('max_price')

  return (
    <div className="space-y-1">
      {/* Search active badge */}
      {searchQuery && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20">
          <div className="text-xs font-bold text-primary mb-1">SEARCH RESULTS FOR:</div>
          <div className="text-sm font-semibold text-dark">"{searchQuery}"</div>
          <Link href="/products" className="text-xs text-primary hover:underline mt-1 inline-block">
            Clear search
          </Link>
        </div>
      )}

      {/* All Products */}
      <div
        onClick={() => setCategory(null)}
        className={`cursor-pointer px-3 py-2 text-sm font-bold tracking-wide border-l-2 transition-all ${
          !activeCategory ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-dark hover:border-dark'
        }`}
      >
        All Products
      </div>

      {/* Categories */}
      <div className="pt-3">
        <div className="text-[11px] font-black tracking-[2px] text-dark uppercase mb-2 px-3">
          Categories
        </div>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-2 border-l-2 transition-all ${
              activeCategory === cat.slug
                ? 'border-primary text-primary bg-primary/5 font-bold'
                : 'border-transparent text-gray-500 hover:text-dark hover:border-dark'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: cat.bg_color }}
            />
            {cat.name}
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="pt-4">
        <div className="text-[11px] font-black tracking-[2px] text-dark uppercase mb-2 px-3">
          Price Range
        </div>
        {PRICE_RANGES.map((range) => {
          const isActive =
            String(range.min === 0 ? '' : range.min) === (currentMin ?? '') &&
            (range.max === 9999 ? !currentMax : String(range.max) === (currentMax ?? ''))
          return (
            <div
              key={range.label}
              onClick={() => setPriceRange(range.min || null, range.max)}
              className={`cursor-pointer px-3 py-2 text-sm border-l-2 transition-all ${
                isActive
                  ? 'border-primary text-primary bg-primary/5 font-bold'
                  : 'border-transparent text-gray-500 hover:text-dark hover:border-dark'
              }`}
            >
              {range.label}
            </div>
          )
        })}
        {(currentMin || currentMax) && (
          <div
            onClick={() => setPriceRange(null, null)}
            className="cursor-pointer px-3 py-1 text-xs text-primary hover:underline"
          >
            Clear price filter
          </div>
        )}
      </div>

      {/* Specialty */}
      <div className="pt-4">
        <div className="text-[11px] font-black tracking-[2px] text-dark uppercase mb-2 px-3">
          More Ways To Shop
        </div>
        {[
          { label: 'New Arrivals', href: '/products?new=true' },
          { label: 'Best Sellers', href: '/products?sort=rating' },
          { label: 'On Sale', href: '/products?badge=sale' },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="block px-3 py-2 text-sm text-gray-500 hover:text-primary border-l-2 border-transparent hover:border-primary transition-all"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
