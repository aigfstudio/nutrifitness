'use client'

import { useState, useEffect } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'

interface ShopControlsProps {
  sort: string
  activeCategory: string
  categories: { name: string; slug: string }[]
  searchParams: Record<string, string>
}

export function ShopControls({ sort, activeCategory, categories, searchParams }: ShopControlsProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', value)
    window.location.href = `/products?${params}`
  }

  const handleCategory = (value: string) => {
    if (value) {
      window.location.href = `/products?category=${encodeURIComponent(value)}`
    } else {
      window.location.href = '/products'
    }
  }

  return (
    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
      {/* Mobile category dropdown */}
      <div className="lg:hidden">
        <select
          onChange={(e) => handleCategory(e.target.value)}
          value={activeCategory}
          className="border border-gray-300 px-3 py-2 text-sm focus:outline-none bg-white rounded-sm"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm text-gray-500">{isMounted ? t.productsList.sortBy : 'Sort By:'}</span>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-dark bg-white rounded-sm"
        >
          <option value="featured">{isMounted ? t.productsList.topSellers : 'Top Sellers'}</option>
          <option value="price_asc">{isMounted ? t.productsList.priceLowHigh : 'Price: Low to High'}</option>
          <option value="price_desc">{isMounted ? t.productsList.priceHighLow : 'Price: High to Low'}</option>
          <option value="rating">{isMounted ? t.productsList.rating : 'Customer Rating'}</option>
        </select>
      </div>
    </div>
  )
}
