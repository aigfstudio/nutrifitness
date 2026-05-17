'use client'

import Link from 'next/link'
import Image from 'next/image'

export function HeroSlider() {
  return (
    <div className="max-w-[1400px] mx-auto px-0 sm:px-4 mt-4 mb-8">
      <Link href="/products?badge=sale" className="block relative w-full overflow-hidden hover:opacity-95 transition-opacity">
        <Image
          src="/imgi_59_4418711619_May26GetReadyforSummerSale_Ecomm_HPH_3_DSK.jpg"
          alt="Buy 1 Get 1 50% Off Summer Sale"
          width={1400}
          height={460}
          className="w-full h-auto object-cover object-center hidden sm:block"
          priority
        />
        {/* Fallback/Mobile view could use a mobile specific image if one exists, but for now we'll scale the desktop one */}
        <Image
          src="/imgi_20_4418711619_May26GetReadyforSummerSale_Ecomm_HPH_3_MOB (1).jpg"
          alt="Buy 1 Get 1 50% Off Summer Sale"
          width={750}
          height={850}
          className="w-full h-auto object-cover object-center block sm:hidden"
          priority
        />
      </Link>
    </div>
  )
}
