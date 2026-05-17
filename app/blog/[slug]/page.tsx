import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS } from '../page'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title + ' | NutriFitness Blog',
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] }
  }
}

export default function BlogPostPage({ params }: PageProps) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2)
  const otherPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div
        className="h-72 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 max-w-[900px] mx-auto">
          <div className="text-[10px] font-black tracking-widest text-[#c8102e] uppercase mb-2">{post.categoryName}</div>
          <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-300 mt-3">
            <span>📅 {post.date}</span>
            <span>⏱ {post.readTime} read</span>
            <span>✍️ NutriFitness Team</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#c8102e]">Home</Link>
          {' '}›{' '}
          <Link href="/blog" className="hover:text-[#c8102e]">Blog</Link>
          {' '}›{' '}
          <span className="text-dark">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Article */}
          <div>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-[#c8102e] pl-4">
              {post.excerpt}
            </p>

            <div
              className="prose prose-lg max-w-none text-gray-700 prose-headings:font-display prose-headings:text-dark prose-a:text-[#c8102e] prose-a:no-underline hover:prose-a:underline prose-strong:text-dark prose-li:text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Product CTA */}
            {post.relatedProduct && (
              <div className="mt-10 bg-gray-50 border border-gray-200 rounded-sm p-6 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs font-black tracking-widest text-[#c8102e] uppercase mb-1">Recommended Product</div>
                  <div className="font-display text-xl text-dark">{post.relatedProduct.name}</div>
                </div>
                <Link
                  href={`/products/${post.relatedProduct.slug}`}
                  className="bg-[#c8102e] text-white px-6 py-3 text-sm font-black tracking-wider hover:bg-[#a50d28] transition-colors whitespace-nowrap"
                >
                  SHOP NOW →
                </Link>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-xs font-black tracking-widest text-gray-400 uppercase mb-3">Share This Article</div>
              <div className="flex gap-3">
                {['Twitter/X', 'Facebook', 'WhatsApp'].map(s => (
                  <button key={s} className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-500 hover:border-dark hover:text-dark transition-colors rounded-sm">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Related posts */}
            {(related.length > 0 ? related : otherPosts.slice(0, 2)).length > 0 && (
              <div>
                <div className="text-xs font-black tracking-widest text-dark uppercase mb-4 pb-2 border-b-2 border-[#c8102e]">
                  RELATED ARTICLES
                </div>
                <div className="space-y-4">
                  {(related.length > 0 ? related : otherPosts.slice(0, 2)).map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3">
                      <div
                        className="w-20 h-16 bg-cover bg-center flex-shrink-0 rounded-sm"
                        style={{ backgroundImage: `url(${p.image})` }}
                      />
                      <div>
                        <div className="text-xs font-bold text-dark group-hover:text-[#c8102e] transition-colors leading-tight">{p.title}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{p.readTime} read</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Shop CTA sidebar */}
            <div className="bg-[#111] text-white p-6 rounded-sm">
              <div className="text-xs font-black tracking-widest text-[#c8102e] uppercase mb-2">Our Store</div>
              <div className="font-display text-2xl mb-2">Shop Premium Supplements</div>
              <p className="text-gray-400 text-xs mb-4">Free shipping over CHF 79. 30-day returns.</p>
              <Link
                href="/products"
                className="block text-center bg-[#c8102e] text-white px-4 py-3 text-xs font-black tracking-widest hover:bg-[#a50d28] transition-colors"
              >
                SHOP NOW →
              </Link>
            </div>

            {/* All posts */}
            <div>
              <div className="text-xs font-black tracking-widest text-dark uppercase mb-4 pb-2 border-b-2 border-[#c8102e]">
                MORE ARTICLES
              </div>
              <div className="space-y-2">
                {otherPosts.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="block text-sm text-gray-600 hover:text-[#c8102e] transition-colors py-1 border-b border-gray-50">
                    {p.title}
                  </Link>
                ))}
                <Link href="/blog" className="block text-xs font-black text-[#c8102e] hover:underline mt-2">
                  View All Articles →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
