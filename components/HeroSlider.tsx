'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { Banner } from '@/lib/types'

interface HeroSliderProps {
  banners: Banner[]
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const slides = banners.length > 0
    ? banners
    : [
        {
          id: '1',
          title: 'BUILD YOUR BEST BODY',
          subtitle: 'Premium Swiss nutrition. Keto, protein & performance supplements delivered to your door.',
          badge: 'New Drop 2025',
          cta_text: 'SHOP NOW',
          cta_link: '/products',
          cta2_text: 'VIEW KETO RANGE',
          cta2_link: '/products?category=keto',
          bg_color: '#080808',
          image_url: null,
          is_active: true,
          sort_order: 1,
          created_at: '',
          updated_at: '',
        } as Banner,
      ]

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, next, slides.length])

  const slide = slides[current]

  return (
    <div
      className="relative overflow-hidden"
      style={{ minHeight: 420 }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{ background: slide.bg_color }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border-[80px] border-primary/5 pointer-events-none" />
          <div className="absolute right-16 -bottom-16 w-56 h-56 rounded-full border-[40px] border-primary/5 pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] rounded-full border border-primary/5 pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {slide.badge && (
                <div className="inline-block bg-primary text-white text-[11px] font-bold tracking-[2px] px-3 py-1.5 mb-5 uppercase">
                  {slide.badge}
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-6xl sm:text-8xl text-white leading-none mb-4 max-w-2xl"
            >
              {slide.title.split('|').map((line, i) => (
                <span
                  key={i}
                  className={`block ${i === 1 ? 'text-primary' : 'text-white'}`}
                >
                  {line}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-gray-400 text-sm sm:text-base max-w-sm mb-8 leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href={slide.cta_link ?? '/products'}
                className="bg-primary text-white px-8 py-3.5 text-sm font-bold tracking-wider hover:bg-primary-dark transition-all duration-300 inline-block shadow-glow hover:shadow-glow-hover hover:-translate-y-0.5 rounded-sm"
              >
                {slide.cta_text ?? 'SHOP NOW'}
              </Link>
              {slide.cta2_text && (
                <Link
                  href={slide.cta2_link ?? '/products'}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3.5 text-sm font-bold tracking-wider hover:border-white/50 hover:bg-white/20 transition-all duration-300 inline-block rounded-sm hover:-translate-y-0.5"
                >
                  {slide.cta2_text}
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev/Next buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-7 bg-primary' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
