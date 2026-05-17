'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

interface ProductDetailClientProps {
  product: Product
  discount: number | null
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-base ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-500">({count} reviews)</span>
    </div>
  )
}

export function ProductDetailClient({ product, discount }: ProductDetailClientProps) {
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = () => {
    setAdding(true)
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.images?.[0] ?? null,
      brand: product.brand,
      price: product.price,
      quantity,
      flavor: selectedFlavor,
    })
    toast.success(`${product.name.slice(0, 25)}... added to cart!`)
    setTimeout(() => {
      setAdding(false)
      openCart()
    }, 600)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Brand */}
      {product.brand && (
        <div className="text-xs font-bold tracking-[3px] text-gray-400 uppercase">
          {product.brand}
        </div>
      )}

      {/* Name */}
      <h1 className="font-display text-4xl sm:text-5xl text-dark leading-none tracking-wide">
        {product.name}
      </h1>

      {/* Rating */}
      <StarRating rating={product.rating} count={product.review_count} />

      {/* Badge */}
      {product.badge_text && (
        <div
          className="inline-block text-white text-sm font-bold px-4 py-1.5 w-fit"
          style={{ background: product.badge_color }}
        >
          {product.badge_text}
        </div>
      )}

      {/* Short description */}
      {product.description_short && (
        <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-border pt-4">
          {product.description_short}
        </p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 border-t border-gray-border pt-4">
        {product.price_original && (
          <span className="text-lg text-gray-400 line-through">
            CHF {product.price_original.toFixed(2)}
          </span>
        )}
        <span className="text-4xl font-bold text-dark">
          CHF {product.price.toFixed(2)}
        </span>
        {discount && (
          <span className="text-base font-bold text-green-600">Save {discount}%</span>
        )}
      </div>
      {product.currency && (
        <p className="text-xs text-gray-400 -mt-3">Currency: {product.currency}</p>
      )}

      {/* Flavors */}
      {product.flavors && product.flavors.length > 0 && (
        <div>
          <div className="text-xs font-bold tracking-wider text-dark uppercase mb-2">
            Flavor: <span className="text-primary">{selectedFlavor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.flavors.map((flavor) => (
              <button
                key={flavor}
                onClick={() => setSelectedFlavor(flavor)}
                className={`px-4 py-2 text-sm font-semibold border-[1.5px] transition-all ${
                  selectedFlavor === flavor
                    ? 'border-dark bg-dark text-white'
                    : 'border-gray-border text-gray-500 hover:border-dark'
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <div className="text-xs font-bold tracking-wider text-dark uppercase mb-2">Quantity</div>
        <div className="flex items-center border border-gray-border w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-12 flex items-center justify-center text-xl hover:bg-gray-light transition-colors"
          >
            −
          </button>
          <span className="w-14 text-center font-bold text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-12 flex items-center justify-center text-xl hover:bg-gray-light transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!product.in_stock || adding}
        className={`w-full py-4 text-sm font-bold tracking-wider transition-all ${
          adding
            ? 'bg-green-600 text-white'
            : 'bg-primary text-white hover:bg-primary-dark'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {!product.in_stock
          ? 'OUT OF STOCK'
          : adding
          ? '✓ ADDED TO CART!'
          : `ADD TO CART — CHF ${(product.price * quantity).toFixed(2)}`}
      </button>

      {/* Meta info */}
      <div className="border-t border-gray-border pt-4 grid grid-cols-2 gap-3">
        {product.sku && (
          <div>
            <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">SKU</div>
            <div className="text-sm font-semibold text-dark">{product.sku}</div>
          </div>
        )}
        {product.weight_g && (
          <div>
            <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Weight</div>
            <div className="text-sm font-semibold text-dark">{product.weight_g}g</div>
          </div>
        )}
        {product.category && (
          <div>
            <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Category</div>
            <div className="text-sm font-semibold text-dark">{product.category}</div>
          </div>
        )}
        <div>
          <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Availability</div>
          <div className={`text-sm font-bold ${product.in_stock ? 'text-green-600' : 'text-primary'}`}>
            {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="border border-gray-border p-4 grid grid-cols-3 gap-4 text-center">
        {[
          { icon: '🚚', label: 'Free Shipping', sub: 'Orders over CHF 79' },
          { icon: '↩', label: '30-Day Returns', sub: 'No questions asked' },
          { icon: '🛡', label: 'Swiss Quality', sub: 'Lab certified' },
        ].map(({ icon, label, sub }) => (
          <div key={label}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-[11px] font-bold text-dark">{label}</div>
            <div className="text-[10px] text-gray-400">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
