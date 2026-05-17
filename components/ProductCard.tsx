'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

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
          className={`text-xs ${
            star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'
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
    toast.success(`${product.name.slice(0, 30)}... added to cart!`)
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
    <Link href={`/products/${product.slug}`} className="product-card group block bg-white border border-gray-border">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-light">
        {mainImage ? (
          <Image
            src={isSupabaseUrl ? mainImage : `/products/${mainImage}`}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
        ) : (
          // Placeholder
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: '#1a1a3a' }}
          >
            <div className="text-white/10 font-display text-8xl absolute select-none">
              {product.category?.charAt(0) ?? 'N'}
            </div>
            <div className="relative z-10 bg-white/95 w-20 h-28 flex flex-col items-center justify-center p-2 text-center">
              <div className="text-[7px] font-black uppercase text-dark/80 leading-tight">
                {product.brand?.split(' ').slice(0, 3).join(' ')}
              </div>
              <div className="text-[8px] font-bold text-dark mt-1 leading-tight">
                {product.name.split(' ').slice(0, 4).join(' ')}
              </div>
            </div>
          </div>
        )}

        {/* Badge */}
        {product.badge_text && (
          <div
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 z-10"
            style={{ background: product.badge_color ?? '#c8102e' }}
          >
            {product.badge_text}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white border border-gray-border rounded-full flex items-center justify-center text-base hover:border-primary transition-colors"
        >
          <span className={liked ? 'text-primary' : 'text-gray-300'}>
            {liked ? '♥' : '♡'}
          </span>
        </button>

        {/* Out of stock overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <span className="bg-dark text-white text-xs font-bold px-3 py-1.5 tracking-wider">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        {product.brand && (
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase truncate">
            {product.brand}
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-gray-400">({product.review_count})</span>
        </div>

        <h3 className="text-sm font-semibold text-dark leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.description_short && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
            {product.description_short}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          {product.price_original && (
            <span className="text-xs text-gray-400 line-through">
              CHF {product.price_original.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-dark">
            CHF {product.price.toFixed(2)}
          </span>
          {discount && (
            <span className="text-xs font-bold text-green-600">Save {discount}%</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock || addingToCart}
          className={`w-full mt-2 py-2.5 text-xs font-bold tracking-wider transition-all ${
            addingToCart
              ? 'bg-green-600 text-white'
              : 'bg-white text-dark border-[1.5px] border-dark hover:bg-dark hover:text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {addingToCart ? '✓ ADDED!' : 'ADD TO CART'}
        </button>
      </div>
    </Link>
  )
}
