'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/pos', label: 'Point of Sale', icon: '💻' },
  { href: '/admin/banners', label: 'Banners', icon: '🖼' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/categories', label: 'Categories', icon: '📂' },
  { href: '/admin/offers', label: 'Offers', icon: '🏷' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/promo', label: 'Promo Bar', icon: '📢' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data || data.role !== 'admin') {
        router.push('/')
        return
      }
      setProfile(data as Profile)
      setChecking(false)
    }
    check()
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-light flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:flex ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-dark-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-white px-2 py-0.5 font-display text-xl leading-none">NF</div>
            <div className="font-display text-lg text-white leading-none">
              NUTRI<span className="text-primary">FITNESS</span>
            </div>
          </Link>
          <div className="text-[10px] tracking-[2px] text-gray-500 mt-1 uppercase">Admin Panel</div>
        </div>

        {/* Admin info */}
        <div className="px-5 py-4 border-b border-dark-3">
          <div className="text-xs font-bold text-white">{profile?.full_name ?? 'Admin'}</div>
          <div className="text-[10px] text-gray-500 font-bold tracking-wider uppercase mt-0.5">Administrator</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold border-l-4 transition-all admin-nav-link ${
                  isActive
                    ? 'border-l-primary text-primary bg-primary/10 active'
                    : 'border-l-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-dark-3 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
          >
            ← Back to Store
          </Link>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/auth/login'))}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 border border-gray-border"
          >
            ☰
          </button>
          <div className="font-display text-xl text-dark tracking-wide">
            {NAV_ITEMS.find(i => i.exact ? pathname === i.href : pathname.startsWith(i.href))?.label ?? 'Admin'}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              target="_blank"
              className="text-xs text-gray-400 hover:text-primary transition-colors"
            >
              View Store ↗
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
