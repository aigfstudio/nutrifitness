'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, openCart } = useCartStore()
  const itemCount = totalItems()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'SHOP', href: '/products' },
    { label: 'PROTEIN', href: '/products?category=protein' },
    { label: 'PRE-WORKOUT', href: '/products?category=pre-workout' },
    { label: 'KETO', href: '/products?category=keto' },
    { label: 'DEALS', href: '/products?badge=sale', red: true },
    { label: 'NEW ARRIVALS', href: '/products?new=true' },
  ]

  return (
    <>
      {/* Promo top bar */}
      <div className="bg-dark text-white text-center py-2 px-4 text-xs font-semibold tracking-wide">
        <span className="text-primary">🔥</span> Buy 1, Get 1 50% Off! —{' '}
        <Link href="/products" className="underline hover:text-primary transition-colors">
          SHOP NOW
        </Link>
        <span className="mx-4 text-dark-4 hidden sm:inline">|</span>
        <span className="hidden sm:inline">Free Shipping Over CHF 79</span>
      </div>

      {/* Main navbar */}
      <nav
        className={`bg-white/85 backdrop-blur-md border-b border-gray-border/60 sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-sm py-0' : 'py-1'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-primary text-white px-2.5 py-1 font-display text-2xl leading-none group-hover:bg-primary-dark transition-colors">
              NF
            </div>
            <div>
              <div className="font-display text-xl text-dark leading-none">
                NUTRI<span className="text-primary">FITNESS</span>
              </div>
              <div className="text-[8px] tracking-[3px] text-gray-400 leading-none mt-0.5">
                SINCE 2018
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
            }}
            className="flex flex-1 max-w-xl mx-4 hidden sm:flex"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What can we help you find today?"
              className="flex-1 border border-r-0 border-gray-border/60 bg-gray-50/50 px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="bg-dark text-white px-5 py-2.5 text-sm hover:bg-primary transition-colors duration-300 shadow-sm"
            >
              🔍
            </button>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-5">
            {/* Account */}
            <Link
              href={user ? '/account' : '/auth/login'}
              className="hidden sm:flex flex-col items-center text-xs font-semibold text-dark hover:text-primary transition-colors"
            >
              <span className="text-xl mb-0.5">👤</span>
              <span>{user ? (profile?.full_name?.split(' ')[0] ?? 'Account') : 'Sign In'}</span>
            </Link>

            {/* Admin link */}
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:flex flex-col items-center text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                <span className="text-xl mb-0.5">⚙️</span>
                <span>Admin</span>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="flex flex-col items-center text-xs font-semibold text-dark hover:text-primary transition-colors duration-300 relative group"
            >
              <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">🛒</span>
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-glow">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 border border-gray-border"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Secondary nav */}
        <div className="border-t border-gray-border overflow-x-auto hidden sm:block">
          <div className="max-w-[1400px] mx-auto px-4 flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 text-xs font-bold tracking-wider whitespace-nowrap hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary ${
                  link.red ? 'text-primary' : 'text-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-border bg-white">
            <div className="px-4 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
                }}
                className="flex mb-3"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 border border-r-0 border-gray-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="bg-dark text-white px-3 py-2 text-sm"
                >
                  🔍
                </button>
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 text-sm font-bold border-b border-gray-border last:border-0 ${
                    link.red ? 'text-primary' : 'text-dark'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={user ? '/account' : '/auth/login'}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-bold text-dark mt-1"
              >
                👤 {user ? 'My Account' : 'Sign In'}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
