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

  const subNavLinks = [
    { label: 'ALL PRODUCTS', href: '/products' },
    { label: 'PROTEINS', href: '/products?category=Proteins' },
    { label: 'PRE-WORKOUT', href: '/products?category=Pre Workout' },
    { label: 'CREATINE', href: '/products?category=CREATINE' },
    { label: 'SNACKS', href: '/products?category=SNACKS' },
    { label: 'VITAMINS', href: '/products?category=Vitamins & Minerals' },
    { label: 'WEIGHT LOSS', href: '/products?category=Weight Loss' },
  ]

  return (
    <>
      {/* Tier 1: Thin Top Bar (Gray) */}
      <div className="bg-[#F4F4F4] text-[#555555] border-b border-gray-200 py-1.5 px-4 text-[11px] font-medium tracking-wide">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <button className="hover:underline">Enable Accessibility</button>
            <span className="text-gray-300">|</span>
            <Link href="/contact" className="hover:underline">Find a Store</Link>
          </div>
          <div className="hidden md:block font-bold text-dark uppercase tracking-widest">
            Buy 1, Get 1 50% Off!
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 text-sm">★</span>
            <Link href="/account" className="font-bold hover:underline uppercase text-dark">
              Make Me a PRO Access Member
            </Link>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Header (White) */}
      <header className="bg-white border-b border-gray-border py-4 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo - Styled like GNC's Red Bold font */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 group">
            <div className="text-primary font-black text-3xl tracking-tighter leading-none font-display">
              NF
            </div>
            <div className="border-l-2 border-primary pl-2 flex flex-col justify-center">
              <span className="font-display font-black text-xl text-dark tracking-wide leading-none">
                NUTRI<span className="text-primary">FITNESS</span>
              </span>
              <span className="text-[7px] font-bold tracking-[3.5px] text-gray-400 leading-none mt-0.5 uppercase">
                LIVE WELL
              </span>
            </div>
          </Link>

          {/* Search Bar - Giant Centralized */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
            }}
            className="flex-1 max-w-2xl relative flex items-center hidden sm:flex"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What can we help you find today?"
              className="w-full border-2 border-gray-200 hover:border-gray-400 focus:border-dark px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-colors pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 text-lg text-gray-500 hover:text-dark transition-colors"
            >
              🔍
            </button>
          </form>

          {/* Right Action Icons (User & Cart) */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Account Icon */}
            <Link
              href={user ? '/account' : '/auth/login'}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
              title={user ? 'Account' : 'Sign In'}
            >
              <span className="text-xl text-dark">👤</span>
              {user && (
                <span className="absolute -top-1 -right-1 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
              )}
            </Link>

            {/* Admin gear if admin */}
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                title="Admin Dashboard"
              >
                <span className="text-xl text-primary">⚙️</span>
              </Link>
            )}

            {/* Cart Icon */}
            <button
              onClick={openCart}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
              title="Shopping Cart"
            >
              <span className="text-xl text-dark">🛒</span>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 text-2xl text-dark hover:bg-gray-100 rounded-md"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Tier 3: Sub-Nav Links */}
        <div className="border-t border-gray-100 mt-3 pt-3 hidden sm:block">
          <div className="max-w-[1400px] mx-auto flex items-center gap-6 overflow-x-auto scrollbar-none">
            {subNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-black tracking-widest whitespace-nowrap hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1 text-dark"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-border bg-white mt-3 pt-3">
            <div className="px-2 pb-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
                }}
                className="flex relative items-center mb-4"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded-sm focus:outline-none"
                />
                <button type="submit" className="absolute right-3 text-gray-500">
                  🔍
                </button>
              </form>
              {subNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-xs font-black tracking-widest border-b border-gray-100 last:border-0 uppercase text-dark"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={user ? '/account' : '/auth/login'}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-xs font-black tracking-widest text-dark mt-2 border-t border-gray-200"
              >
                👤 {user ? 'MY ACCOUNT' : 'SIGN IN / REGISTER'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Tier 4: Promo Bar (Black with vertical bars) */}
      <div className="bg-[#000000] text-white py-2 px-4 text-[10px] font-black tracking-widest uppercase border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 text-center items-center">
          <div className="hover:text-primary transition-colors cursor-pointer">
            Buy 1, Get 1 50% Off!
          </div>
          <div className="hidden md:block border-x border-gray-700 px-4 hover:text-primary transition-colors cursor-pointer">
            Free Shipping Over CHF 79
          </div>
          <div className="hidden md:block hover:text-primary transition-colors cursor-pointer">
            Save 10% When You Pick Up In-Store!
          </div>
        </div>
      </div>
    </>
  )
}

