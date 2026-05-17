'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from './types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, flavor?: string) => void
  updateQuantity: (productId: string, quantity: number, flavor?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === newItem.product_id && i.flavor === newItem.flavor
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === newItem.product_id && i.flavor === newItem.flavor
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId, flavor) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product_id === productId && i.flavor === (flavor ?? null))
          ),
        }))
      },

      updateQuantity: (productId, quantity, flavor) => {
        if (quantity <= 0) {
          get().removeItem(productId, flavor)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId && i.flavor === (flavor ?? null)
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'nf_cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
