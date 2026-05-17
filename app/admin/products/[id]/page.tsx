'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Product, Category } from '@/lib/types'

interface PageProps { params: { id: string } }

type ProductForm = Omit<Product, 'id' | 'created_at' | 'updated_at'>

const EMPTY: ProductForm = {
  sku: '', name: '', brand: '', slug: '',
  description_short: '', description_long: '',
  category: '', subcategory: '',
  price: 0, price_original: null, currency: 'CHF',
  weight_g: null, flavors: [], images: [],
  in_stock: true, is_featured: false, is_new: false,
  badge_text: '', badge_color: '#c8102e',
  rating: 0, review_count: 0, tags: [],
  stock_quantity: 0,
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminProductEditPage({ params }: PageProps) {
  const router = useRouter()
  const isNew = params.id === 'new'
  const [form, setForm] = useState<ProductForm>(EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [imageInput, setImageInput] = useState('')
  const [flavorInput, setFlavorInput] = useState('')
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories((data ?? []) as Category[])
    })
    if (!isNew) {
      supabase.from('products').select('*').eq('id', params.id).single().then(({ data, error }) => {
        if (error || !data) { toast.error('Product not found'); router.push('/admin/products'); return }
        const { id, created_at, updated_at, ...rest } = data as Product
        setForm({ ...rest, flavors: rest.flavors ?? [], images: rest.images ?? [], tags: rest.tags ?? [] })
        setLoading(false)
      })
    }
  }, [params.id, isNew, router])

  const set = (key: keyof ProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked
      : e.target.type === 'number' ? (e.target.value ? Number(e.target.value) : null)
      : e.target.value
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const autoSlug = useCallback(() => {
    if (!form.slug && form.name) setForm(prev => ({ ...prev, slug: slugify(prev.name) }))
  }, [form.slug, form.name])

  const addImage = () => {
    if (!imageInput.trim()) return
    setForm(prev => ({ ...prev, images: [...(prev.images ?? []), imageInput.trim()] }))
    setImageInput('')
  }
  const removeImage = (i: number) => setForm(prev => ({ ...prev, images: (prev.images ?? []).filter((_, idx) => idx !== i) }))

  const addFlavor = () => {
    if (!flavorInput.trim()) return
    setForm(prev => ({ ...prev, flavors: [...(prev.flavors ?? []), flavorInput.trim()] }))
    setFlavorInput('')
  }
  const removeFlavor = (i: number) => setForm(prev => ({ ...prev, flavors: (prev.flavors ?? []).filter((_, idx) => idx !== i) }))

  const addTag = () => {
    if (!tagInput.trim()) return
    setForm(prev => ({ ...prev, tags: [...(prev.tags ?? []), tagInput.trim()] }))
    setTagInput('')
  }
  const removeTag = (i: number) => setForm(prev => ({ ...prev, tags: (prev.tags ?? []).filter((_, idx) => idx !== i) }))

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Product name is required'); return }
    if (!form.slug.trim()) { toast.error('Slug is required'); return }
    if (!form.price || form.price <= 0) { toast.error('Price must be greater than 0'); return }
    setSaving(true)
    const payload = { ...form, price: Number(form.price), price_original: form.price_original ? Number(form.price_original) : null }
    if (isNew) {
      const { error } = await supabase.from('products').insert(payload)
      if (error) toast.error(error.message)
      else { toast.success('Product created!'); router.push('/admin/products') }
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', params.id)
      if (error) toast.error(error.message)
      else toast.success('Product updated!')
    }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-dark tracking-wide">
            {isNew ? 'ADD NEW PRODUCT' : 'EDIT PRODUCT'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isNew ? 'Fill in all fields and save to publish immediately.' : `Editing: ${form.name}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin/products')} className="px-5 py-2.5 border border-gray-border text-sm font-bold hover:bg-gray-light transition-colors">
            ← BACK
          </button>
          <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
            {saving ? 'SAVING...' : isNew ? 'CREATE PRODUCT' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>

      {/* ── Section: Basic Info ── */}
      <Section title="BASIC INFORMATION">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Product Name *</Label>
            <input value={form.name} onChange={set('name')} onBlur={autoSlug} placeholder="Gold Standard 100% Whey - Vanilla" className={INPUT} />
          </div>
          <div>
            <Label>Brand</Label>
            <input value={form.brand ?? ''} onChange={set('brand')} placeholder="Optimum Nutrition" className={INPUT} />
          </div>
          <div>
            <Label>SKU</Label>
            <input value={form.sku ?? ''} onChange={set('sku')} placeholder="NF-001" className={INPUT} />
          </div>
          <div>
            <Label>URL Slug * <span className="font-normal text-gray-400 normal-case">(auto-filled from name)</span></Label>
            <input value={form.slug} onChange={set('slug')} placeholder="gold-standard-whey-vanilla" className={INPUT} />
          </div>
          <div>
            <Label>Category</Label>
            <select value={form.category ?? ''} onChange={set('category')} className={INPUT}>
              <option value="">Select category...</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Subcategory</Label>
            <input value={form.subcategory ?? ''} onChange={set('subcategory')} placeholder="Whey Protein" className={INPUT} />
          </div>
          <div>
            <Label>Weight (grams)</Label>
            <input type="number" value={form.weight_g ?? ''} onChange={set('weight_g')} placeholder="1000" className={INPUT} />
          </div>
        </div>
      </Section>

      {/* ── Section: Pricing ── */}
      <Section title="PRICING">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Sale Price (CHF) *</Label>
            <input type="number" step="0.01" value={form.price} onChange={set('price')} placeholder="89.99" className={INPUT} />
          </div>
          <div>
            <Label>Original Price (CHF) <span className="font-normal text-gray-400">(for strike-through)</span></Label>
            <input type="number" step="0.01" value={form.price_original ?? ''} onChange={set('price_original')} placeholder="109.99" className={INPUT} />
          </div>
          <div>
            <Label>Currency</Label>
            <select value={form.currency} onChange={set('currency')} className={INPUT}>
              <option value="CHF">CHF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        {form.price_original && form.price_original > form.price && (
          <div className="mt-2 inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5">
            <span className="text-xs font-bold text-green-700">
              DISCOUNT: {Math.round((1 - form.price / form.price_original) * 100)}% OFF
            </span>
            <span className="text-xs text-green-600">
              (Customer saves CHF {(form.price_original - form.price).toFixed(2)})
            </span>
          </div>
        )}
      </Section>

      {/* ── Section: Badge / Offer Label ── */}
      <Section title="BADGE & OFFER LABEL">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Badge Text</Label>
            <input value={form.badge_text ?? ''} onChange={set('badge_text')} placeholder="BOGO 50% | Best Seller | 37% OFF" className={INPUT} />
          </div>
          <div>
            <Label>Badge Color</Label>
            <div className="flex gap-2">
              <input type="color" value={form.badge_color} onChange={set('badge_color')} className="h-11 w-14 border border-gray-border p-1 cursor-pointer" />
              <input value={form.badge_color} onChange={set('badge_color')} className={INPUT + ' flex-1'} />
            </div>
          </div>
        </div>
        {form.badge_text && (
          <div className="mt-3">
            <div className="inline-block text-white text-xs font-bold px-3 py-1.5" style={{ background: form.badge_color }}>
              {form.badge_text}
            </div>
            <span className="text-xs text-gray-400 ml-2">← Badge preview</span>
          </div>
        )}
      </Section>

      {/* ── Section: Descriptions ── */}
      <Section title="DESCRIPTIONS">
        <div>
          <Label>Short Description <span className="font-normal text-gray-400">(appears on product cards and product page)</span></Label>
          <textarea value={form.description_short ?? ''} onChange={set('description_short')} rows={3} placeholder="Pure creatine monohydrate. 50 servings of 5g creatine. Easy to mix." className={INPUT + ' resize-none'} />
        </div>
        <div className="mt-4">
          <Label>Long Description <span className="font-normal text-gray-400">(supports HTML — use &lt;h3&gt;, &lt;ul&gt;, &lt;p&gt; tags)</span></Label>
          <textarea
            value={form.description_long ?? ''}
            onChange={set('description_long')}
            rows={12}
            placeholder={`<p>Product description paragraph...</p>\n<h3>Key Benefits</h3>\n<ul>\n  <li>5g Creatine Monohydrate per serving</li>\n  <li>Mixes instantly</li>\n</ul>`}
            className={INPUT + ' resize-y font-mono text-xs'}
          />
          {form.description_long && (
            <div className="mt-3 p-4 border border-gray-border bg-gray-light">
              <div className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">HTML Preview</div>
              <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: form.description_long }} />
            </div>
          )}
        </div>
      </Section>

      {/* ── Section: Gallery ── */}
      <Section title="PRODUCT GALLERY">
        <p className="text-xs text-gray-400 mb-3">
          Add image URLs (from Supabase Storage or any CDN). First image is the main image.
        </p>
        <div className="flex gap-2 mb-3">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addImage()}
            placeholder="https://... or filename.jpg"
            className={INPUT + ' flex-1'}
          />
          <button onClick={addImage} className="bg-dark text-white px-4 text-sm font-bold hover:bg-dark-2 transition-colors">
            ADD
          </button>
        </div>
        {(form.images ?? []).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(form.images ?? []).map((img, i) => (
              <div key={i} className="relative group">
                <div className="aspect-square bg-gray-light border border-gray-border flex items-center justify-center overflow-hidden">
                  {img.startsWith('http') ? (
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-gray-400 text-center px-2 break-all">{img}</div>
                  )}
                </div>
                <div className="text-xs text-gray-400 text-center mt-1">{i === 0 ? '★ Main' : `#${i + 1}`}</div>
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-primary text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Section: Flavors & Variants ── */}
      <Section title="FLAVORS / VARIANTS">
        <div className="flex gap-2 mb-3">
          <input
            value={flavorInput}
            onChange={(e) => setFlavorInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addFlavor()}
            placeholder="e.g. Vanilla, Chocolate, Unflavored"
            className={INPUT + ' flex-1'}
          />
          <button onClick={addFlavor} className="bg-dark text-white px-4 text-sm font-bold hover:bg-dark-2 transition-colors">ADD</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.flavors ?? []).map((f, i) => (
            <span key={i} className="flex items-center gap-1 bg-gray-light border border-gray-border px-3 py-1 text-sm font-semibold">
              {f}
              <button onClick={() => removeFlavor(i)} className="text-gray-400 hover:text-primary ml-1 font-bold text-base leading-none">×</button>
            </span>
          ))}
        </div>
      </Section>

      {/* ── Section: Tags ── */}
      <Section title="TAGS">
        <div className="flex gap-2 mb-3">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            placeholder="e.g. creatine, protein, keto"
            className={INPUT + ' flex-1'}
          />
          <button onClick={addTag} className="bg-dark text-white px-4 text-sm font-bold hover:bg-dark-2 transition-colors">ADD</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.tags ?? []).map((t, i) => (
            <span key={i} className="flex items-center gap-1 bg-dark text-white px-3 py-1 text-xs font-bold">
              {t}
              <button onClick={() => removeTag(i)} className="text-gray-300 hover:text-primary ml-1 font-bold text-base leading-none">×</button>
            </span>
          ))}
        </div>
      </Section>

      {/* ── Section: Status ── */}
      <Section title="STATUS & VISIBILITY">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'in_stock', label: 'In Stock', sub: 'Product is available to buy' },
            { key: 'is_featured', label: 'Featured', sub: 'Show in Best Sellers section' },
            { key: 'is_new', label: 'New Arrival', sub: 'Show in New Arrivals section' },
          ].map(({ key, label, sub }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer p-3 border border-gray-border hover:border-dark transition-colors">
              <input
                type="checkbox"
                checked={!!form[key as keyof ProductForm]}
                onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.checked }))}
                className="mt-0.5 w-4 h-4 accent-primary"
              />
              <div>
                <div className="text-sm font-bold text-dark">{label}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </div>
            </label>
          ))}
        </div>
      </Section>

      {/* Save button bottom */}
      <div className="flex gap-3 pb-8">
        <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-8 py-3.5 text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
          {saving ? 'SAVING...' : isNew ? 'CREATE PRODUCT' : 'SAVE ALL CHANGES'}
        </button>
        <button onClick={() => router.push('/admin/products')} className="px-8 py-3.5 border border-gray-border text-sm font-bold hover:bg-gray-light transition-colors">
          CANCEL
        </button>
        {!isNew && (
          <a
            href={`/products/${form.slug}`}
            target="_blank"
            className="px-6 py-3.5 border border-gray-border text-sm font-bold hover:bg-gray-light transition-colors"
          >
            VIEW IN STORE ↗
          </a>
        )}
      </div>
    </div>
  )
}

const INPUT = 'w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">
      {children}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-border">
      <div className="px-5 py-3 border-b border-gray-border bg-gray-light">
        <h2 className="text-xs font-black tracking-[2px] text-dark uppercase">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}
