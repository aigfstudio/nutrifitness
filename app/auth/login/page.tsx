'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      // Check role and redirect admins to /admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user!.id)
        .single()
      if (profile?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/account')
      }
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

        <div className="bg-white border border-gray-border p-8 md:p-10 shadow-sm w-full max-w-md page-transition z-10 relative">
        <h1 className="font-display text-3xl text-dark mb-6 text-center tracking-wide">{isMounted ? t.auth.signIn : 'SIGN IN'}</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">{isMounted ? t.auth.email : 'Email Address'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase">{isMounted ? t.auth.password : 'Password'}</label>
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">{isMounted ? t.auth.forgot : 'Forgot Password?'}</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 font-bold tracking-wider text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? (isMounted ? t.auth.signingIn : 'SIGNING IN...') : (isMounted ? t.auth.signIn : 'SIGN IN')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-border text-center">
          <p className="text-sm text-gray-500 mb-4">{isMounted ? t.auth.noAccount : "Don't have an account?"}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/register" className="border-2 border-dark text-dark px-6 py-2 text-sm font-bold hover:bg-dark hover:text-white transition-colors">
              {isMounted ? t.auth.registerFree : 'Register Free'}
            </Link>
          </div>
        </div>
      </div>     
        {/* Pro promo */}
        <div className="mt-4 p-4 bg-dark text-center w-full max-w-md page-transition z-10 relative">
          <div className="inline-block bg-primary px-3 py-1 text-xs font-bold tracking-widest mb-4">PRO ACCESS</div>
          <h2 className="font-display text-2xl mb-4 leading-none text-white">{isMounted ? t.auth.joinPro : 'Join Pro Access'}</h2>
          <p className="text-gray-300 text-sm mb-6">{isMounted ? t.auth.proDesc : 'BOGO deals · 10% cash back · Free shipping'}</p>
          <Link href="/pro" className="bg-white text-dark px-8 py-2.5 text-sm font-bold tracking-wider hover:bg-gray-100 transition-colors inline-block">
            {isMounted ? t.auth.learnMore : 'LEARN MORE'}
          </Link>
        </div>
      </div>
    </div>
  )
}
