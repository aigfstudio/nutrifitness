'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Please check your email to verify.')
      router.push('/auth/login')
    }
    setLoading(false)
  }

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-light py-12 px-4 page-transition">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-primary text-white px-2.5 py-1 font-display text-2xl leading-none">NF</div>
            <div className="font-display text-2xl text-dark">
              NUTRI<span className="text-primary">FITNESS</span>
            </div>
          </Link>
        </div>

        <div className="bg-white border border-gray-border p-8 shadow-sm">
          <h1 className="font-display text-3xl text-dark mb-6 tracking-wide">{isMounted ? t.auth.createAccount : 'CREATE ACCOUNT'}</h1>

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { key: 'name', label: isMounted ? t.auth.createAccount.split(' ')[1] === 'UN' ? 'Nom Complet' : 'Full Name' : 'Full Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: isMounted ? t.auth.email : 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: isMounted ? t.auth.password : 'Password', type: 'password', placeholder: '••••••••' },
              { key: 'confirm', label: isMounted ? t.auth.confirmPass : 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold tracking-wider text-dark uppercase mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={update(key)}
                  required
                  placeholder={placeholder}
                  className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3.5 text-sm font-bold tracking-wider hover:bg-dark-2 transition-colors disabled:opacity-50"
            >
              {loading ? (isMounted ? t.auth.creating : 'CREATING ACCOUNT...') : (isMounted ? t.auth.createAccount : 'CREATE ACCOUNT')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-border text-center">
            <p className="text-sm text-gray-500">
              {isMounted ? t.auth.hasAccount : 'Already have an account?'}{' '}
              <Link href="/auth/login" className="text-primary font-bold hover:text-primary-dark">
                {isMounted ? t.auth.signIn : 'Sign In'}
              </Link>
            </p>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-4">
            {isMounted ? t.auth.agreeTerms : 'By creating an account, you agree to our'}{' '}
            <Link href="/terms" className="text-primary hover:underline">{isMounted ? t.auth.terms : 'Terms & Conditions'}</Link>{' '}
            {isMounted ? t.auth.and : 'and'}{' '}
            <Link href="/privacy" className="text-primary hover:underline">{isMounted ? t.auth.privacy : 'Privacy Policy'}</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
