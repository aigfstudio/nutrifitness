'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      router.push('/account')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-light py-12 px-4 page-transition">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-primary text-white px-2.5 py-1 font-display text-2xl leading-none">NF</div>
            <div className="font-display text-2xl text-dark">
              NUTRI<span className="text-primary">FITNESS</span>
            </div>
          </Link>
        </div>

        <div className="bg-white border border-gray-border p-8 shadow-sm">
          <h1 className="font-display text-3xl text-dark mb-6 tracking-wide">SIGN IN</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-dark uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-dark uppercase mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
              <div className="text-right mt-1">
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3.5 text-sm font-bold tracking-wider hover:bg-dark-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-border">
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-primary font-bold hover:text-primary-dark">
                Register Free
              </Link>
            </p>
          </div>

          {/* Pro promo */}
          <div className="mt-4 p-4 bg-dark text-center">
            <div className="text-[10px] font-bold tracking-[2px] text-gray-400 uppercase mb-1">
              Join Pro Access
            </div>
            <div className="text-white text-sm font-semibold mb-2">
              BOGO deals · 10% cash back · Free shipping
            </div>
            <button className="bg-primary text-white text-xs font-bold px-5 py-2 hover:bg-primary-dark transition-colors">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
