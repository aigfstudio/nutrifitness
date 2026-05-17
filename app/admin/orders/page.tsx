'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Order } from '@/lib/types'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders((data ?? []) as Order[])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success(`Order updated to ${status}`); fetchOrders() }
  }

  const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl text-dark tracking-wide">ORDERS</h1>
        <p className="text-sm text-gray-400 mt-1">{orders.length} total orders</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...STATUS_OPTIONS].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 text-xs font-bold capitalize transition-colors ${
              statusFilter === status ? 'bg-dark text-white' : 'bg-white border border-gray-border text-gray-500 hover:border-dark'
            }`}
          >
            {status === 'all' ? `All (${orders.length})` : `${status} (${orders.filter(o => o.status === status).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-border p-12 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="font-display text-2xl text-dark mb-2">NO ORDERS{statusFilter !== 'all' ? ` WITH STATUS "${statusFilter.toUpperCase()}"` : ' YET'}</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white border border-gray-border overflow-hidden">
              {/* Order header */}
              <div
                className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-light/30 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-bold text-dark">{order.order_number}</div>
                    <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-CH', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${STATUS_COLORS[order.status] ?? 'bg-gray-100'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-dark">CHF {order.total.toFixed(2)}</span>

                  {/* Status update */}
                  <select
                    value={order.status}
                    onChange={(e) => { e.stopPropagation(); updateStatus(order.id, e.target.value) }}
                    onClick={(e) => e.stopPropagation()}
                    className="border border-gray-border px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-primary bg-white capitalize"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <span className="text-gray-400 text-sm">{expanded === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Order details */}
              {expanded === order.id && (
                <div className="border-t border-gray-border px-5 py-4 bg-gray-light/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <div className="text-xs font-black tracking-[2px] text-gray-400 uppercase mb-3">Order Items</div>
                      <div className="space-y-2">
                        {(order.items as any[]).map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-border last:border-0">
                            <div>
                              <div className="font-semibold text-dark">{item.product_name}</div>
                              {item.flavor && <div className="text-xs text-gray-400">{item.flavor}</div>}
                              <div className="text-xs text-gray-400">× {item.quantity}</div>
                            </div>
                            <div className="font-bold text-dark">CHF {(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="font-semibold">CHF {order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Shipping</span>
                          <span className="font-semibold">{order.shipping_cost > 0 ? `CHF ${order.shipping_cost.toFixed(2)}` : 'Free'}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold border-t border-gray-border pt-1">
                          <span>Total</span>
                          <span>CHF {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping address */}
                    {order.shipping_address && (
                      <div>
                        <div className="text-xs font-black tracking-[2px] text-gray-400 uppercase mb-3">Shipping Address</div>
                        <div className="text-sm text-dark space-y-0.5">
                          <div className="font-semibold">{(order.shipping_address as any).full_name}</div>
                          <div>{(order.shipping_address as any).address_line1}</div>
                          {(order.shipping_address as any).address_line2 && <div>{(order.shipping_address as any).address_line2}</div>}
                          <div>{(order.shipping_address as any).postal_code} {(order.shipping_address as any).city}</div>
                          <div>{(order.shipping_address as any).country}</div>
                          {(order.shipping_address as any).phone && <div className="text-gray-400">{(order.shipping_address as any).phone}</div>}
                        </div>
                      </div>
                    )}
                  </div>

                  {order.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-border">
                      <div className="text-xs font-black tracking-[2px] text-gray-400 uppercase mb-1">Customer Notes</div>
                      <div className="text-sm text-dark">{order.notes}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
