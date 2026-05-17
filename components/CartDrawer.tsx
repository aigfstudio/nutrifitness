'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && closeCart()
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, closeCart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const total = totalPrice()
  const count = totalItems()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-border">
              <div>
                <h2 className="font-display text-2xl text-dark">YOUR CART</h2>
                <p className="text-xs text-gray-400">{count} item{count !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center border border-gray-border hover:border-dark transition-colors text-xl"
              >
                ×
              </button>
            </div>

            {/* Free shipping bar */}
            {total > 0 && total < 79 && (
              <div className="px-5 py-3 bg-gray-light text-xs text-center">
                <span className="font-bold text-dark">
                  CHF {(79 - total).toFixed(2)} away
                </span>{' '}
                from free shipping!
                <div className="mt-1.5 h-1.5 bg-gray-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.min((total / 79) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="font-display text-2xl text-dark mb-2">YOUR CART IS EMPTY</h3>
                  <p className="text-sm text-gray-400 mb-6">Add some products to get started!</p>
                  <button
                    onClick={closeCart}
                    className="bg-primary text-white px-8 py-3 text-sm font-bold tracking-wider hover:bg-primary-dark transition-colors"
                  >
                    SHOP NOW
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.product_id}-${item.flavor}`} className="flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-light flex-shrink-0 relative overflow-hidden">
                      {item.product_image ? (
                        <Image
                          src={item.product_image.startsWith('http') ? item.product_image : `/products/${item.product_image}`}
                          alt={item.product_name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-dark-3 flex items-center justify-center">
                          <span className="text-white font-display text-2xl">{item.product_name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {item.brand && (
                        <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">
                          {item.brand}
                        </div>
                      )}
                      <Link
                        href={`/products/${item.product_slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-dark hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product_name}
                      </Link>
                      {item.flavor && (
                        <div className="text-xs text-gray-400 mt-0.5">{item.flavor}</div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty */}
                        <div className="flex items-center border border-gray-border">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.flavor ?? undefined)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-light text-sm"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.flavor ?? undefined)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-light text-sm"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">
                            CHF {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product_id, item.flavor ?? undefined)}
                            className="text-gray-300 hover:text-primary text-lg leading-none transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-border px-5 py-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-dark">CHF {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Shipping</span>
                  <span>{total >= 79 ? '🎉 FREE' : 'calculated at checkout'}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-primary text-white text-center py-4 font-bold tracking-wider text-sm hover:bg-primary-dark transition-colors"
                >
                  PROCEED TO CHECKOUT — CHF {total.toFixed(2)}
                </Link>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="block w-full bg-white text-dark border-[1.5px] border-dark text-center py-3 font-bold tracking-wider text-sm hover:bg-gray-light transition-colors"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
