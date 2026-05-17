'use client'

import Link from 'next/link'

export function HeroSlider() {
  return (
    <div className="max-w-[1400px] mx-auto px-0 sm:px-4 mt-4">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#e11c2a] via-[#f12c3a] to-[#ff4747] text-white flex flex-col md:flex-row items-stretch min-h-[460px]">
        
        {/* Left Side: Vertical SALE banner (Clean White Panel) */}
        <div className="bg-white text-dark flex flex-col items-center justify-between py-6 px-4 md:w-36 flex-shrink-0 border-r border-gray-100 hidden sm:flex">
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-[2px] text-gray-400 block uppercase leading-none mb-1">
              Get Ready
            </span>
            <span className="text-[10px] font-bold tracking-[2px] text-gray-400 block uppercase leading-none">
              For Summer
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-1.5 my-6">
            {['S', 'A', 'L', 'E'].map((letter, idx) => (
              <span 
                key={idx} 
                className="font-display font-black text-4xl text-primary leading-none"
              >
                {letter}
              </span>
            ))}
          </div>
          
          <div className="w-8 h-1 bg-primary"></div>
        </div>

        {/* Center/Right Side: Main Promotional Message */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 relative z-10">
          
          {/* Subtle tropical/hibiscus geometric background overlays */}
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full border-[60px] border-white" />
            <div className="absolute left-1/3 bottom-10 w-96 h-96 rounded-full border-[30px] border-white" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <h3 className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-2">
              BUY 1, GET 1
            </h3>
            
            <h1 className="font-display font-black text-7xl sm:text-9xl tracking-tighter leading-none text-white uppercase drop-shadow-md mb-6">
              50% OFF!
            </h1>

            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#FFE600] tracking-wide uppercase leading-tight mb-2">
              LOOK YOUR BEST. FEEL YOUR BEST. AND SAVE!
            </h2>

            <p className="text-sm sm:text-base font-bold text-white/90 tracking-wide uppercase mb-8">
              NEW ITEMS ADDED. THIS WEEK ONLY.{' '}
              <span className="text-white/70 font-normal">In stores and online. Limited time.</span>
            </p>

            <div>
              <Link
                href="/products"
                className="inline-block bg-white text-dark hover:bg-dark hover:text-white px-10 py-4 text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-lg rounded-sm"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
