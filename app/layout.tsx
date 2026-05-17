import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { Toaster } from 'react-hot-toast'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NutriFitness.ch — Premium Swiss Supplements',
    template: '%s | NutriFitness.ch',
  },
  description:
    'Premium Swiss nutrition and fitness supplements. Keto, protein, pre-workout and more. Free shipping over CHF 79.',
  keywords: ['supplements', 'protein', 'keto', 'fitness', 'switzerland', 'nutrition'],
  openGraph: {
    title: 'NutriFitness.ch — Premium Swiss Supplements',
    description:
      'Premium Swiss nutrition and fitness supplements. Keto, protein, pre-workout and more.',
    url: 'https://nutrifitness.ch',
    siteName: 'NutriFitness',
    locale: 'en_CH',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="font-body bg-white text-dark antialiased">
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 600,
              fontSize: '14px',
            },
            success: {
              style: { background: '#111', color: '#fff' },
              iconTheme: { primary: '#c8102e', secondary: '#fff' },
            },
            error: {
              style: { background: '#c8102e', color: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
