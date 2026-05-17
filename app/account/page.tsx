'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Profile, Order } from '@/lib/types'
import type { User } from '@supabase/supabase-js'
import { LayoutDashboard, Package, User as UserIcon, Heart, CheckCircle, Clock, LogOut } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon size={18} /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
]

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ full_name: '', phone: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const [{ data: profileData }, { data: ordersData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      setProfile(profileData)
      setFormData({ full_name: profileData?.full_name ?? '', phone: profileData?.phone ?? '' })
      setOrders((ordersData ?? []) as Order[])
      setLoading(false)
    }
    init()
  }, [router])

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: formData.full_name,
      phone: formData.phone,
    }).eq('id', user.id)
    if (error) toast.error('Failed to save profile')
    else {
      toast.success('Profile updated!')
      setProfile(prev => prev ? { ...prev, ...formData } : prev)
      setEditMode(false)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 page-transition">
      <h1 className="font-display text-4xl text-dark tracking-wide mb-8">MY ACCOUNT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-gray-border p-4 mb-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-3 text-2xl">
              {profile?.full_name?.charAt(0)?.toUpperCase() ?? <UserIcon size={32} />}
            </div>
            <div className="font-bold text-dark">{profile?.full_name ?? 'Customer'}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="mt-2 inline-block bg-primary text-white text-xs font-bold px-4 py-1.5 hover:bg-primary-dark transition-colors"
              >
                ADMIN PANEL
              </Link>
            )}
          </div>

          <nav className="bg-white border border-gray-border overflow-hidden">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 text-sm font-semibold border-b border-gray-border last:border-0 border-l-4 transition-all ${
                  activeTab === item.id
                    ? 'border-l-primary text-primary bg-primary/5'
                    : 'border-l-transparent text-gray-500 hover:text-dark hover:bg-gray-light'
                }`}
              >
                <div className="flex items-center gap-2">{item.icon} {item.label}</div>
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 text-left px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-gray-border"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3 space-y-4">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="font-display text-2xl text-dark mb-4">DASHBOARD</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Orders', value: orders.length, icon: <Package size={32} /> },
                  { label: 'Completed', value: orders.filter(o => o.status === 'delivered').length, icon: <CheckCircle size={32} /> },
                  { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: <Clock size={32} /> },
                ].map(stat => (
                  <div key={stat.label} className="bg-white border border-gray-border p-5">
                    <div className="text-gray-400 mb-3">{stat.icon}</div>
                    <div className="font-display text-3xl text-dark">{stat.value}</div>
                    <div className="text-xs font-bold tracking-wider text-gray-400 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>

              {orders.length > 0 && (
                <div className="bg-white border border-gray-border">
                  <div className="px-5 py-4 border-b border-gray-border flex items-center justify-between">
                    <h3 className="font-bold text-dark">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-primary font-bold hover:underline">
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-gray-border">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-dark">{order.order_number}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleDateString('en-CH')}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">CHF {order.total.toFixed(2)}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-display text-2xl text-dark mb-4">MY ORDERS</h2>
              {orders.length === 0 ? (
                <div className="bg-white border border-gray-border p-12 text-center">
                  <div className="flex justify-center mb-4 text-gray-300"><Package size={64} strokeWidth={1} /></div>
                  <h3 className="font-display text-2xl text-dark mb-2">NO ORDERS YET</h3>
                  <p className="text-gray-400 text-sm mb-6">Time to get shopping!</p>
                  <Link href="/products" className="bg-primary text-white px-8 py-3 text-sm font-bold tracking-wider hover:bg-primary-dark transition-colors inline-block">
                    SHOP NOW
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-border p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-dark">{order.order_number}</div>
                          <div className="text-xs text-gray-400">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-CH')}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-dark">CHF {order.total.toFixed(2)}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded uppercase ${STATUS_COLORS[order.status] ?? 'bg-gray-100'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-gray-border pt-3">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Items</div>
                        <div className="space-y-1">
                          {(order.items as any[]).map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-dark">{item.product_name} {item.flavor ? `(${item.flavor})` : ''} × {item.quantity}</span>
                              <span className="font-semibold text-dark">CHF {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl text-dark">MY PROFILE</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-dark text-white px-5 py-2 text-sm font-bold hover:bg-dark-2 transition-colors"
                  >
                    EDIT PROFILE
                  </button>
                )}
              </div>
              <div className="bg-white border border-gray-border p-6 space-y-4">
                {[
                  { label: 'Full Name', key: 'full_name', value: profile?.full_name ?? '' },
                  { label: 'Phone', key: 'phone', value: profile?.phone ?? '' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">
                      {field.label}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      />
                    ) : (
                      <div className="text-sm text-dark font-semibold border border-gray-border px-4 py-3 bg-gray-light">
                        {field.value || <span className="text-gray-400 font-normal">Not set</span>}
                      </div>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">
                    Email Address
                  </label>
                  <div className="text-sm text-dark font-semibold border border-gray-border px-4 py-3 bg-gray-light">
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
                </div>

                {editMode && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {saving ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-white text-dark border border-dark px-6 py-2.5 text-sm font-bold hover:bg-gray-light transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="font-display text-2xl text-dark mb-4">MY WISHLIST</h2>
              <div className="bg-white border border-gray-border p-12 text-center">
                <div className="flex justify-center mb-4 text-gray-300"><Heart size={64} strokeWidth={1} /></div>
                <h3 className="font-display text-2xl text-dark mb-2">YOUR WISHLIST IS EMPTY</h3>
                <p className="text-gray-400 text-sm mb-6">Save items you love for later!</p>
                <Link href="/products" className="bg-primary text-white px-8 py-3 text-sm font-bold tracking-wider hover:bg-primary-dark transition-colors inline-block">
                  BROWSE PRODUCTS
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
