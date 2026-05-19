'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-[10px] ${
            star <= Math.round(rating) ? 'text-primary' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [liked, setLiked] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addItem } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)
  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const discount = product.price_original
    ? Math.round((1 - product.price / product.price_original) * 100)
    : null

  const mainImage = product.images?.[0] ?? null
  const isSupabaseUrl = mainImage?.startsWith('http')

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAddingToCart(true)
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: mainImage,
      brand: product.brand,
      price: product.price,
      quantity: 1,
      flavor: product.flavors?.[0] ?? null,
    })
    toast.success(`${product.name.slice(0, 30)}... added to cart!`, {
      style: { background: '#0a0a0a', color: '#fff', border: '1px solid #c8102e' }
    })
    setTimeout(() => setAddingToCart(false), 600)
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sign in to save items')
      setLiked(liked)
      return
    }
    if (!liked) {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: product.id })
      toast.success('Added to wishlist!')
    } else {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id)
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block bg-white border border-gray-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-glow-hover hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-light flex items-center justify-center p-4">
        {mainImage ? (
          <Image
            src={isSupabaseUrl ? mainImage : `/products/${mainImage}`}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
            priority={priority}
            unoptimized={isSupabaseUrl}
          />
        ) : (
          <div className="text-gray-300 font-display text-6xl opacity-30 select-none">
            {product.category?.charAt(0) ?? 'N'}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge_text && (
            <span className="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              {product.badge_text}
            </span>
          )}
          {discount && !product.badge_text && (
            <span className="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              -{discount}% {isMounted ? t.product.sale : 'Sale'}
            </span>
          )}
          {product.is_new && (
            <span className="bg-dark text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              {isMounted ? t.product.new : 'New'}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:text-primary hover:shadow-md transition-all duration-200"
        >
          <span className={`text-sm ${liked ? 'text-primary' : 'text-gray-400'}`}>
            {liked ? '♥' : '♡'}
          </span>
        </button>

        {/* Out of stock overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-dark text-white text-xs font-bold px-4 py-2 rounded-sm tracking-widest shadow-lg uppercase">
              {isMounted ? t.product.outOfStock : 'Out of Stock'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5 bg-gradient-to-b from-white to-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase truncate pr-2">
            {product.brand || 'NUTRIFITNESS'}
          </span>
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <StarRating rating={product.rating || 5} />
            <span className="text-[9px] text-gray-400">({product.review_count || 0})</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-dark leading-snug line-clamp-2 min-h-[2.6rem] group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-border/50">
          <div className="flex flex-col">
            {product.price_original ? (
              <span className="text-[10px] text-gray-400 line-through leading-none">
                CHF {product.price_original.toFixed(2)}
              </span>
            ) : <span className="h-[10px]" />}
            <span className="text-lg font-display text-dark leading-none mt-1">
              CHF {product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock || addingToCart}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold shadow-sm transition-all duration-300 ${
              addingToCart
                ? 'bg-green-500 text-white shadow-green-500/30'
                : 'bg-dark text-white hover:bg-primary hover:shadow-glow'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {addingToCart ? '✓' : '+'}
          </button>
        </div>
      </div>
    </Link>
  )
}
