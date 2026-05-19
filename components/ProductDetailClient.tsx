'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'
import { Truck, RotateCcw, ShieldCheck, Flame, RefreshCcw, Star, Check, X, Heart } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'

interface ProductDetailClientProps {
  product: Product
  discount: number | null
  images: string[]
  relatedProducts?: Product[]
}

function StarRating({ rating, count, t, isMounted }: { rating: number; count: number; t: any; isMounted: boolean }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < fullStars ? 'text-amber-400' : hasHalf && i === fullStars ? 'text-amber-400' : 'text-gray-300'} 
            fill={i < fullStars || (hasHalf && i === fullStars) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      <a href="#reviews" className="text-sm text-[#c8102e] font-semibold hover:underline">
        ({count})
      </a>
      <span className="text-gray-300">|</span>
      <a href="#qa" className="text-sm text-[#c8102e] font-semibold hover:underline">
        {isMounted ? `${Math.floor(count * 0.12)} ${t.productDetail.answeredQuestions}` : `${Math.floor(count * 0.12)} Answered Questions`}
      </a>
      <span className="text-gray-300">|</span>
      <a href="#reviews" className="text-sm text-[#c8102e] font-semibold hover:underline">
        {isMounted ? t.productDetail.writeReview : 'Write A Review'}
      </a>
    </div>
  )
}

export function ProductDetailClient({ product, discount, images, relatedProducts = [] }: ProductDetailClientProps) {
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscribe'>('one-time')
  const [deliveryFreq, setDeliveryFreq] = useState('30')
  const [activeImg, setActiveImg] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const { addItem, openCart } = useCartStore()
  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const subscribePrice = product.price * 0.9
  const displayPrice = purchaseType === 'subscribe' ? subscribePrice : product.price
  const perServing = product.weight_g ? (displayPrice / (product.weight_g / 10)).toFixed(2) : null
  const pointsEarned = Math.floor(displayPrice * 4.5)

  const handleAddToCart = () => {
    setAdding(true)
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.images?.[0] ?? null,
      brand: product.brand,
      price: displayPrice,
      quantity,
      flavor: selectedFlavor,
    })
    toast.success(`${product.name.slice(0, 30)}... added to cart!`)
    setTimeout(() => {
      setAdding(false)
      openCart()
    }, 600)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 max-w-[1200px] mx-auto px-4 py-6">
      {/* ── Left: Image Gallery ── */}
      <div className="flex flex-col gap-3">
        {/* Badges */}
        <div className="flex gap-2">
          {product.badge_text && (
            <span
              className="text-white text-[11px] font-bold px-3 py-1.5 tracking-wide"
              style={{ background: product.badge_color ?? '#c8102e' }}
            >
              {product.badge_text}
            </span>
          )}
          {product.is_featured && (
            <span className="bg-dark text-white text-[11px] font-bold px-3 py-1.5 tracking-wide">
              {isMounted ? t.productDetail.exclusive : 'NutriFitness Exclusive'}
            </span>
          )}
        </div>

        {/* Main image */}
        <div className="relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden group">
          {images.length > 0 ? (
            <Image
              src={images[activeImg]}
              alt={product.name}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center p-8">
                <div className="text-6xl font-black text-gray-300 mb-2">{product.category?.charAt(0) ?? 'N'}</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{product.name}</div>
              </div>
            </div>
          )}

          {/* Wishlist */}
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:text-[#c8102e] hover:bg-white transition-colors">
            <Heart size={20} />
          </button>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-20 h-20 border-2 overflow-hidden flex-shrink-0 transition-all ${
                  activeImg === i ? 'border-[#c8102e]' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <Image src={img} alt={`View ${i + 1}`} fill sizes="80px" className="object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Guarantees strip */}
        <div className="grid grid-cols-3 gap-3 mt-4 border border-gray-100 p-4">
          {[
            { icon: <Truck size={24} className="mx-auto" strokeWidth={1.5} />, label: isMounted ? t.productDetail.freeShipping : 'Free Shipping', sub: isMounted ? t.productDetail.freeShippingSub : 'On orders over CHF 75' },
            { icon: <RotateCcw size={24} className="mx-auto" strokeWidth={1.5} />, label: isMounted ? t.productDetail.returns : '14-Day Returns', sub: isMounted ? t.productDetail.returnsSub : 'Unopened, sealed' },
            { icon: <ShieldCheck size={24} className="mx-auto" strokeWidth={1.5} />, label: isMounted ? t.productDetail.quality : 'Swiss Quality', sub: isMounted ? t.productDetail.qualitySub : 'Lab certified' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="text-center">
              <div className="mb-2 text-dark">{icon}</div>
              <div className="text-[11px] font-bold text-dark">{label}</div>
              <div className="text-[10px] text-gray-400">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Product Info ── */}
      <div className="flex flex-col gap-4">
        {/* SKU */}
        {product.sku && (
          <div className="text-xs text-gray-400 font-medium tracking-wide">
            {isMounted ? t.productDetail.item : 'ITEM #'} {product.sku}
          </div>
        )}

        {/* Brand */}
        {product.brand && (
          <div className="text-sm font-bold tracking-[2px] text-gray-600 uppercase">{product.brand}</div>
        )}

        {/* Name */}
        <h1 className="font-display text-3xl sm:text-4xl text-dark leading-tight tracking-wide">
          {product.name}
        </h1>

        {/* Purchased count */}
        <div className="bg-orange-50 border border-orange-100 px-4 py-2 flex items-center gap-2 text-xs font-semibold mt-4">
          <Flame size={16} className="text-amber-500" />
          <span className="text-orange-900">
            {isMounted ? t.productDetail.highDemand.replace('{count}', String(Math.floor(Math.random() * 50 + 5))) : `High demand! ${Math.floor(Math.random() * 50 + 5)} people are looking at this right now.`}
          </span>
        </div>

        {/* Rating */}
        <StarRating rating={product.rating || 4} count={product.review_count || 0} t={t} isMounted={isMounted} />

        {/* Price block */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-black text-dark">CHF {displayPrice.toFixed(2)}</span>
            {perServing && (
              <span className="text-sm text-gray-500">(CHF {perServing} / serving)</span>
            )}
            {product.price_original && product.price_original > product.price && (
              <span className="text-lg text-gray-400 line-through">
                CHF {product.price_original.toFixed(2)}
              </span>
            )}
          </div>
          {discount && (
            <div className="text-sm text-green-600 font-bold mt-1">
              {isMounted ? t.productDetail.save.replace('{discount}', String(discount)) : `You save ${discount}%!`}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {isMounted ? t.productDetail.from : 'From'}{' '}
            <span className="font-bold text-dark">
              CHF {(subscribePrice / 3).toFixed(0)}{isMounted ? t.productDetail.month : '/month'}
            </span>{' '}
            {isMounted ? t.productDetail.interest : 'at 0% interest with'}{' '}
            <span className="font-bold text-dark">Klarna</span>
          </div>
        </div>

        {/* BOGO Banner */}
        <div className="flex items-center gap-3 bg-[#e6f0f9] px-4 py-3 rounded-sm">
          <div className="bg-[#c8102e] text-white text-[10px] font-black px-2.5 py-1.5 tracking-widest whitespace-nowrap">
            {isMounted ? t.productDetail.bogoBanner : 'BOGO 50% MIX-AND-MATCH'}
          </div>
          <span className="text-xs text-gray-500">ℹ</span>
          <a href="/products?badge=sale" className="text-[#c8102e] text-xs font-black tracking-widest ml-auto hover:underline">
            {isMounted ? t.productDetail.shopNow : 'SHOP NOW →'}
          </a>
        </div>

        {/* Flavors */}
        {product.flavors && product.flavors.length > 0 && (
          <div>
            <div className="text-xs font-bold tracking-wider text-dark uppercase mb-2">
              {isMounted ? t.productDetail.flavor : 'Flavor:'} <span className="text-[#c8102e]">{selectedFlavor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.flavors.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`px-4 py-2 text-sm font-semibold border-[1.5px] transition-all rounded-sm ${
                    selectedFlavor === flavor
                      ? 'border-dark bg-dark text-white'
                      : 'border-gray-200 text-gray-500 hover:border-dark'
                  }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Choose How Often */}
        <div className="border border-gray-200 rounded-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
            <span className="text-xs font-black tracking-widest text-dark uppercase">{isMounted ? t.productDetail.chooseHowOften : 'Choose How Often'}</span>
          </div>

          {/* One-Time */}
          <label className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-gray-100 ${purchaseType === 'one-time' ? 'bg-white' : 'hover:bg-gray-50'}`}>
            <input
              type="radio"
              name="purchase_type"
              checked={purchaseType === 'one-time'}
              onChange={() => setPurchaseType('one-time')}
              className="accent-[#c8102e] w-4 h-4"
            />
            <div className="flex-1">
              <div className="text-sm font-semibold text-dark">{isMounted ? t.productDetail.oneTime : 'One Time Purchase'}</div>
              <div className="text-xs text-gray-500">CHF {product.price.toFixed(2)}</div>
            </div>
          </label>

          {/* Subscribe */}
          <label className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${purchaseType === 'subscribe' ? 'bg-[#f0f8f0]' : 'hover:bg-gray-50'}`}>
            <input
              type="radio"
              name="purchase_type"
              checked={purchaseType === 'subscribe'}
              onChange={() => setPurchaseType('subscribe')}
              className="accent-[#c8102e] w-4 h-4 mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-dark">CHF {subscribePrice.toFixed(2)}</span>
                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <RefreshCcw size={14} /> {isMounted ? t.productDetail.subscribeTitle : 'Subscribe to Save'}
                </span>
              </div>
              <div className="text-xs text-green-700 font-semibold mt-0.5">{isMounted ? t.productDetail.subscribeDesc : 'Save 10% On Every Order + Free Shipping'}</div>
              {purchaseType === 'subscribe' && (
                <div className="mt-3">
                  <div className="text-xs font-bold text-dark mb-1.5">{isMounted ? t.productDetail.deliverEvery : 'Deliver Every'}</div>
                  <select
                    value={deliveryFreq}
                    onChange={(e) => setDeliveryFreq(e.target.value)}
                    className="border border-gray-300 text-sm px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-dark appearance-none bg-white"
                  >
                    <option value="15">{isMounted ? t.productDetail.days15 : '15 days'}</option>
                    <option value="30">{isMounted ? t.productDetail.days30 : '30 days'}</option>
                    <option value="45">{isMounted ? t.productDetail.days45 : '45 days'}</option>
                    <option value="60">{isMounted ? t.productDetail.days60 : '60 days'}</option>
                    <option value="90">{isMounted ? t.productDetail.days90 : '90 days'}</option>
                  </select>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Qty + Add to Cart */}
        <div className="flex gap-3 items-stretch">
          <div className="relative">
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-full border-2 border-gray-200 px-4 pr-8 text-sm font-bold focus:outline-none focus:border-dark appearance-none bg-white rounded-sm min-w-[80px]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                <option key={q} value={q}>{isMounted ? t.productDetail.qty : 'Qty'} {q}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock || adding}
            className={`flex-1 py-4 text-sm font-black tracking-widest transition-all uppercase rounded-sm ${
              adding
                ? 'bg-green-600 text-white'
                : product.in_stock
                ? 'bg-[#c8102e] text-white hover:bg-[#a50d28] active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!product.in_stock
              ? (isMounted ? t.productDetail.outOfStock : 'OUT OF STOCK')
              : adding
              ? <span className="flex items-center justify-center gap-2"><Check size={18} /> {isMounted ? t.productDetail.added : 'ADDED!'}</span>
              : purchaseType === 'subscribe'
              ? (isMounted ? t.productDetail.addSubscription : 'ADD SUBSCRIPTION TO CART')
              : `${isMounted ? t.productDetail.addToCart : 'ADD TO CART — CHF'} ${(displayPrice * quantity).toFixed(2)}`}
          </button>
        </div>

        {/* Points Banner */}
        <div className="flex items-center justify-center gap-2 bg-[#fff8e1] border border-amber-200 py-3 px-4 rounded-sm">
          <Star size={16} className="text-amber-500" />
          <span className="text-sm font-bold text-dark">
            {isMounted ? t.productDetail.earnPoints : 'EARN'} <span className="text-[#c8102e]">{pointsEarned} {isMounted ? (t.productDetail.pointsWithPurchase.replace('!', '')).split(' ')[0] : 'POINTS'}</span> {isMounted ? t.productDetail.pointsWithPurchase.substring(t.productDetail.pointsWithPurchase.indexOf(' ')) : 'WITH THIS PURCHASE!'}
          </span>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-3">
          {product.sku && (
            <div>
              <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{isMounted ? t.productDetail.sku : 'SKU'}</div>
              <div className="font-semibold text-dark">{product.sku}</div>
            </div>
          )}
          {product.weight_g && (
            <div>
              <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{isMounted ? t.productDetail.weight : 'Weight'}</div>
              <div className="font-semibold text-dark">{product.weight_g}g</div>
            </div>
          )}
          {product.category && (
            <div>
              <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{isMounted ? t.productDetail.category : 'Category'}</div>
              <div className="font-semibold text-dark">{product.category}</div>
            </div>
          )}
          <div>
            <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{isMounted ? t.productDetail.availability : 'Availability'}</div>
            <div className={`font-semibold flex items-center gap-2 ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
              {product.in_stock ? <><Check size={16} /> {isMounted ? t.productDetail.inStock : 'In Stock'}</> : <><X size={16} /> {isMounted ? t.productDetail.outStock : 'Out of Stock'}</>}
            </div>
          </div>
        </div>
      </div>

      {/* Long Description */}
      {product.description_long && (
        <div className="col-span-1 lg:col-span-2 max-w-[1200px] w-full mx-auto mt-12 mb-8">
          <div className="border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="font-display text-2xl text-dark tracking-wide">{isMounted ? t.productDetail.details : 'PRODUCT DETAILS'}</h2>
            </div>
            <div
              id="reviews"
              className="px-6 py-6 prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: product.description_long.replace(/\\n/g, '<br/>'),
              }}
            />
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="col-span-1 lg:col-span-2 w-full mt-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-dark tracking-wide">{isMounted ? t.productDetail.youMayAlsoLike : 'YOU MAY ALSO LIKE'}</h2>
            <Link href={`/products?category=${encodeURIComponent(product.category ?? '')}`} className="text-[#c8102e] text-sm font-bold hover:underline">
              {isMounted ? t.productDetail.viewAll : 'View All →'}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
