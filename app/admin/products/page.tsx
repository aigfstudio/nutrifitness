'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'
import { Package } from 'lucide-react'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts((data ?? []) as Product[])
    setLoading(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Product deleted'); fetchProducts() }
    setDeleting(null)
  }

  const toggleFeatured = async (product: Product) => {
    await supabase.from('products').update({ is_featured: !product.is_featured }).eq('id', product.id)
    toast.success(`${product.is_featured ? 'Removed from' : 'Added to'} featured`)
    fetchProducts()
  }

  const toggleStock = async (product: Product) => {
    await supabase.from('products').update({ in_stock: !product.in_stock }).eq('id', product.id)
    toast.success(`Marked as ${product.in_stock ? 'out of stock' : 'in stock'}`)
    fetchProducts()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-dark tracking-wide">PRODUCTS</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          + ADD PRODUCT
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, brand, or category..."
          className="flex-1 border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
        />
        {search && (
          <button onClick={() => setSearch('')} className="px-4 border border-gray-border text-sm text-gray-400 hover:text-dark transition-colors">
            ✕ Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-border p-12 text-center">
          <div className="flex justify-center mb-4 text-gray-300"><Package size={64} strokeWidth={1} /></div>
          <h3 className="font-display text-2xl text-dark mb-2">
            {search ? 'NO RESULTS FOUND' : 'NO PRODUCTS YET'}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            {search ? `No products match "${search}"` : 'Start by adding your first product.'}
          </p>
          {!search && (
            <Link href="/admin/products/new" className="bg-primary text-white px-8 py-3 text-sm font-bold tracking-wider hover:bg-primary-dark transition-colors inline-block">
              ADD FIRST PRODUCT
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-light border-b border-gray-border">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black tracking-wider text-gray-400 uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-light/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-dark line-clamp-1 max-w-[200px]">{product.name}</div>
                      {product.brand && <div className="text-xs text-gray-400 mt-0.5">{product.brand}</div>}
                      {product.badge_text && (
                        <div
                          className="inline-block text-white text-[9px] font-bold px-1.5 py-0.5 mt-1"
                          style={{ background: product.badge_color }}
                        >
                          {product.badge_text}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{product.category ?? '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-dark">CHF {product.price.toFixed(2)}</div>
                      {product.price_original && (
                        <div className="text-xs text-gray-400 line-through">CHF {product.price_original.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStock(product)}
                        className={`text-[10px] font-bold px-2 py-1 whitespace-nowrap transition-colors ${
                          product.in_stock
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className={`text-[10px] font-bold px-2 py-1 whitespace-nowrap transition-colors ${
                          product.is_featured
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {product.is_featured ? '★ Featured' : '☆ Not Featured'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="bg-dark text-white text-xs font-bold px-3 py-1.5 hover:bg-dark-2 transition-colors whitespace-nowrap"
                        >
                          EDIT
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="bg-white text-primary border border-primary text-xs font-bold px-3 py-1.5 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {deleting === product.id ? '...' : 'DELETE'}
                        </button>
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="text-xs text-gray-400 hover:text-primary transition-colors whitespace-nowrap"
                        >
                          VIEW ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
