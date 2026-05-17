'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const total = totalPrice()
  const freeShipping = total >= 79
  const shipping = freeShipping ? 0 : 9.90
  const orderTotal = total + shipping

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    address_line1: '', address_line2: '',
    city: '', postal_code: '', country: 'Switzerland',
    notes: '',
  })
  const [placing, setPlacing] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center page-transition">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display text-3xl text-dark mb-3">YOUR CART IS EMPTY</h1>
        <Link href="/products" className="bg-primary text-white px-8 py-3 text-sm font-bold hover:bg-primary-dark transition-colors inline-block">
          SHOP NOW
        </Link>
      </div>
    )
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.address_line1 || !form.city || !form.postal_code) {
      toast.error('Please fill in all required fields')
      return
    }
    setPlacing(true)
    const { data: { user } } = await supabase.auth.getUser()

    const shippingAddress = {
      full_name: form.full_name,
      address_line1: form.address_line1,
      address_line2: form.address_line2,
      city: form.city,
      postal_code: form.postal_code,
      country: form.country,
      phone: form.phone,
    }

    const { error } = await supabase.from('orders').insert({
      user_id: user?.id ?? null,
      items: items,
      subtotal: total,
      shipping_cost: shipping,
      total: orderTotal,
      shipping_address: shippingAddress,
      notes: form.notes || null,
      status: 'pending',
    })

    if (error) {
      toast.error('Failed to place order. Please try again.')
      setPlacing(false)
      return
    }

    clearCart()
    toast.success('🎉 Order placed successfully!')
    router.push('/account')
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 page-transition">
      <h1 className="font-display text-4xl text-dark tracking-wide mb-8">CHECKOUT</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <div className="bg-white border border-gray-border p-6">
              <h2 className="font-display text-xl text-dark mb-4 tracking-wide">CONTACT INFORMATION</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'full_name', label: 'Full Name *', type: 'text', placeholder: 'John Doe', col: 2 },
                  { key: 'email', label: 'Email *', type: 'email', placeholder: 'you@example.com' },
                  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+41 79 123 45 67' },
                ].map(({ key, label, type, placeholder, col }) => (
                  <div key={key} className={col === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">{label}</label>
                    <input type={type} value={form[key as keyof typeof form]} onChange={set(key)} required={label.includes('*')} placeholder={placeholder} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-gray-border p-6">
              <h2 className="font-display text-xl text-dark mb-4 tracking-wide">SHIPPING ADDRESS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'address_line1', label: 'Address Line 1 *', placeholder: 'Musterstrasse 1', col: 2 },
                  { key: 'address_line2', label: 'Address Line 2', placeholder: 'Apt 42', col: 2 },
                  { key: 'city', label: 'City *', placeholder: 'Zürich' },
                  { key: 'postal_code', label: 'Postal Code *', placeholder: '8001' },
                ].map(({ key, label, placeholder, col }) => (
                  <div key={key} className={col === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">{label}</label>
                    <input value={form[key as keyof typeof form]} onChange={set(key)} required={label.includes('*')} placeholder={placeholder} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Country</label>
                  <select value={form.country} onChange={set('country')} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white">
                    <option>Switzerland</option>
                    <option>Germany</option>
                    <option>Austria</option>
                    <option>France</option>
                    <option>Italy</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Order Notes (optional)</label>
                  <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Any special instructions..." className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full bg-primary text-white py-4 font-bold tracking-wider text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {placing ? 'PLACING ORDER...' : `PLACE ORDER — CHF ${orderTotal.toFixed(2)}`}
            </button>
            <p className="text-xs text-gray-400 text-center">
              By placing your order you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link>.
            </p>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-border p-5 sticky top-24">
              <h2 className="font-display text-xl text-dark mb-4 tracking-wide">ORDER SUMMARY</h2>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={`${item.product_id}-${item.flavor}`} className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-light flex-shrink-0 relative overflow-hidden">
                      {item.product_image ? (
                        <Image
                          src={item.product_image.startsWith('http') ? item.product_image : `/products/${item.product_image}`}
                          alt={item.product_name}
                          fill sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-dark-3 flex items-center justify-center">
                          <span className="text-white font-display text-xl">{item.product_name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-dark line-clamp-2">{item.product_name}</div>
                      {item.flavor && <div className="text-[10px] text-gray-400">{item.flavor}</div>}
                      <div className="text-[10px] text-gray-400">× {item.quantity}</div>
                    </div>
                    <div className="text-sm font-bold text-dark flex-shrink-0">CHF {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-border pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="font-semibold">CHF {total.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Shipping</span><span className={`font-semibold ${freeShipping ? 'text-green-600' : ''}`}>{freeShipping ? 'Free 🎉' : `CHF ${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-base font-bold border-t border-gray-border pt-2"><span>Total</span><span>CHF {orderTotal.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
