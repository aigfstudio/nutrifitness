import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductDetailClient } from '@/components/ProductDetailClient'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/lib/types'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('products')
    .select('name, description_short, images')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Product Not Found' }

  return {
    title: data.name,
    description: data.description_short ?? '',
    openGraph: {
      title: data.name,
      description: data.description_short ?? '',
      images: data.images?.[0] ? [data.images[0]] : [],
    },
  }
}

export const revalidate = 60

export default async function ProductDetailPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!data) notFound()
  const product = data as Product

  // Related products
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category ?? '')
    .neq('id', product.id)
    .limit(4)

  const relatedProducts = (related ?? []) as Product[]

  const discount = product.price_original
    ? Math.round((1 - product.price / product.price_original) * 100)
    : null

  const images = product.images?.length
    ? product.images
    : []

  return (
    <div className="page-transition">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          {' '}›{' '}
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          {product.category && (
            <>
              {' '}›{' '}
              <Link
                href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-primary transition-colors"
              >
                {product.category}
              </Link>
            </>
          )}
          {' '}›{' '}
          <span className="text-dark font-semibold">{product.name}</span>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Gallery */}
          <div>
            {images.length > 0 ? (
              <div className="space-y-3">
                <div className="relative aspect-square bg-gray-light overflow-hidden">
                  <Image
                    src={images[0].startsWith('http') ? images[0] : `/products/${images[0]}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  {product.badge_text && (
                    <div
                      className="absolute top-4 left-4 text-white text-sm font-bold px-3 py-1.5"
                      style={{ background: product.badge_color }}
                    >
                      {product.badge_text}
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(0, 4).map((img, i) => (
                      <div key={i} className="relative aspect-square bg-gray-light overflow-hidden border-2 border-gray-border hover:border-primary transition-colors cursor-pointer">
                        <Image
                          src={img.startsWith('http') ? img : `/products/${img}`}
                          alt={`${product.name} view ${i + 1}`}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="aspect-square flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: '#1a1a3a' }}
              >
                <div className="text-white/10 font-display text-[200px] absolute select-none leading-none">
                  {product.category?.charAt(0) ?? 'N'}
                </div>
                <div className="relative z-10 bg-white/95 w-48 h-64 flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-[11px] font-black uppercase text-dark/70 leading-tight mb-2">
                    {product.brand}
                  </div>
                  <div className="text-sm font-bold text-dark leading-tight">{product.name}</div>
                  {product.badge_text && (
                    <div
                      className="mt-3 text-white text-[10px] font-bold px-2 py-1"
                      style={{ background: product.badge_color }}
                    >
                      {product.badge_text}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Product Info (client component for interactivity) */}
          <ProductDetailClient product={product} discount={discount} />
        </div>

        {/* Long Description */}
        {product.description_long && (
          <div className="mb-16 border border-gray-border">
            <div className="bg-gray-light px-6 py-4 border-b border-gray-border">
              <h2 className="font-display text-2xl text-dark tracking-wide">PRODUCT DETAILS</h2>
            </div>
            <div
              className="px-6 py-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description_long }}
            />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-display text-3xl text-dark tracking-wide mb-6">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
