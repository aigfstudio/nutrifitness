'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PackagePlus, Image as ImageIcon, Tag, Package, ShoppingCart, Users, DollarSign, Folder, Megaphone } from 'lucide-react'

interface Stats {
  products: number
  orders: number
  customers: number
  revenue: number
}

interface RecentOrder {
  id: string
  order_number: string
  total: number
  status: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, customers: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [{ count: products }, { count: orders }, { count: customers }, { data: orderData }] =
        await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
          supabase.from('orders').select('id,order_number,total,status,created_at').order('created_at', { ascending: false }).limit(6),
        ])

      const revenue = (orderData ?? [])
        .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((sum: number, o: any) => sum + (o.total ?? 0), 0)

      setStats({ products: products ?? 0, orders: orders ?? 0, customers: customers ?? 0, revenue })
      setRecentOrders((orderData ?? []) as RecentOrder[])
      setLoading(false)
    }
    fetchData()
  }, [])

  const quickActions = [
    { label: 'Add New Product', href: '/admin/products/new', icon: <PackagePlus size={24} />, color: 'bg-primary' },
    { label: 'Edit Banners', href: '/admin/banners', icon: <ImageIcon size={24} />, color: 'bg-dark' },
    { label: 'Manage Offers', href: '/admin/offers', icon: <Tag size={24} />, color: 'bg-dark-3' },
    { label: 'View Orders', href: '/admin/orders', icon: <Package size={24} />, color: 'bg-dark-2' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.products, icon: <Package size={32} />, color: 'border-blue-500' },
          { label: 'Total Orders', value: stats.orders, icon: <ShoppingCart size={32} />, color: 'border-primary' },
          { label: 'Customers', value: stats.customers, icon: <Users size={32} />, color: 'border-green-500' },
          { label: 'Revenue (CHF)', value: `${stats.revenue.toFixed(0)}`, icon: <DollarSign size={32} />, color: 'border-yellow-500' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white border-t-4 ${stat.color} p-5 shadow-sm`}>
            <div className="text-gray-400 mb-3">{stat.icon}</div>
            <div className="font-display text-3xl text-dark">{stat.value}</div>
            <div className="text-xs font-bold tracking-wider text-gray-400 uppercase mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-bold text-dark text-sm uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.color} text-white p-4 flex flex-col gap-2 hover:opacity-90 transition-opacity`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-bold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-border">
        <div className="px-5 py-4 border-b border-gray-border flex items-center justify-between">
          <h2 className="font-bold text-dark tracking-wide">RECENT ORDERS</h2>
          <Link href="/admin/orders" className="text-xs text-primary font-bold hover:underline">
            View All →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-light">
                <tr>
                  {['Order #', 'Date', 'Total', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-black tracking-wider text-gray-400 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-light/50 transition-colors">
                    <td className="px-5 py-3 font-bold text-dark">{order.order_number}</td>
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('en-CH')}
                    </td>
                    <td className="px-5 py-3 font-bold">CHF {order.total.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${STATUS_COLORS[order.status] ?? 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders?id=${order.id}`} className="text-xs text-primary font-bold hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin links */}
      <div className="bg-dark p-5">
        <h2 className="font-display text-xl text-white mb-4 tracking-wide">MANAGE YOUR STORE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Hero Banners', sub: 'Update homepage slider images & text', href: '/admin/banners', icon: <ImageIcon size={24} /> },
            { label: 'Products', sub: 'Add, edit, delete products and galleries', href: '/admin/products', icon: <Package size={24} /> },
            { label: 'Categories', sub: 'Manage product categories and colors', href: '/admin/categories', icon: <Folder size={24} /> },
            { label: 'Offers & Deals', sub: 'Create BOGO, % off and fixed discounts', href: '/admin/offers', icon: <Tag size={24} /> },
            { label: 'Orders', sub: 'View and update all customer orders', href: '/admin/orders', icon: <ShoppingCart size={24} /> },
            { label: 'Promo Bar', sub: 'Edit the rotating top banner messages', href: '/admin/promo', icon: <Megaphone size={24} /> },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-dark-2 border border-dark-3 p-4 hover:border-primary/50 transition-colors group"
            >
              <div className="text-gray-300 mb-3">{item.icon}</div>
              <div className="font-bold text-white text-sm group-hover:text-primary transition-colors">{item.label}</div>
              <div className="text-xs text-gray-500 mt-1">{item.sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
