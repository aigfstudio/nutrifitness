'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Banner } from '@/lib/types'
import { Image as ImageIcon } from 'lucide-react'

const EMPTY_BANNER: Omit<Banner, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  subtitle: '',
  badge: '',
  cta_text: 'SHOP NOW',
  cta_link: '/products',
  cta2_text: '',
  cta2_link: '',
  bg_color: '#080808',
  image_url: '',
  is_active: true,
  sort_order: 0,
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState<Omit<Banner, 'id' | 'created_at' | 'updated_at'>>(EMPTY_BANNER)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchBanners() }, [])

  const fetchBanners = async () => {
    const { data } = await supabase.from('banners').select('*').order('sort_order')
    setBanners((data ?? []) as Banner[])
    setLoading(false)
  }

  const openEdit = (banner: Banner) => {
    setEditing(banner)
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      badge: banner.badge ?? '',
      cta_text: banner.cta_text ?? 'SHOP NOW',
      cta_link: banner.cta_link ?? '/products',
      cta2_text: banner.cta2_text ?? '',
      cta2_link: banner.cta2_link ?? '',
      bg_color: banner.bg_color,
      image_url: banner.image_url ?? '',
      is_active: banner.is_active,
      sort_order: banner.sort_order,
    })
  }

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY_BANNER, sort_order: banners.length + 1 })
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('banners').update(form).eq('id', editing.id)
      if (error) toast.error(error.message)
      else { toast.success('Banner updated!'); fetchBanners() }
    } else {
      const { error } = await supabase.from('banners').insert(form)
      if (error) toast.error(error.message)
      else { toast.success('Banner created!'); fetchBanners() }
    }
    setSaving(false)
    setEditing(null)
    setForm(EMPTY_BANNER)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await supabase.from('banners').delete().eq('id', id)
    toast.success('Deleted')
    fetchBanners()
  }

  const toggleActive = async (banner: Banner) => {
    await supabase.from('banners').update({ is_active: !banner.is_active }).eq('id', banner.id)
    fetchBanners()
  }

  const field = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const showForm = editing !== undefined && form.title !== undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-dark tracking-wide">HERO BANNERS</h1>
          <p className="text-sm text-gray-400 mt-1">Manage the homepage hero slider — all changes go live immediately.</p>
        </div>
        <button
          onClick={openNew}
          className="bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          + ADD BANNER
        </button>
      </div>

      {/* Edit/Create Form */}
      {(editing !== null || (form.title !== undefined && !loading)) && (
        <div className="bg-white border border-gray-border p-6">
          <h2 className="font-bold text-dark mb-5 text-lg">
            {editing ? 'EDIT BANNER' : 'NEW BANNER'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">
                Title *
              </label>
              <input
                value={form.title}
                onChange={field('title')}
                placeholder="BUILD YOUR BEST BODY"
                className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gray-400 mt-1">Use | to split into 2 lines e.g. "BUILD YOUR|BEST BODY" (line 2 will be red)</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">
                Subtitle
              </label>
              <textarea
                value={form.subtitle ?? ''}
                onChange={field('subtitle')}
                rows={2}
                placeholder="Premium Swiss nutrition..."
                className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Badge Text</label>
              <input value={form.badge ?? ''} onChange={field('badge')} placeholder="New Drop 2025" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Background Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.bg_color} onChange={field('bg_color')} className="h-11 w-14 border border-gray-border p-1 cursor-pointer" />
                <input value={form.bg_color} onChange={field('bg_color')} placeholder="#080808" className="flex-1 border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">CTA Button Text</label>
              <input value={form.cta_text ?? ''} onChange={field('cta_text')} placeholder="SHOP NOW" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">CTA Link</label>
              <input value={form.cta_link ?? ''} onChange={field('cta_link')} placeholder="/products" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">2nd Button Text</label>
              <input value={form.cta2_text ?? ''} onChange={field('cta2_text')} placeholder="VIEW KETO RANGE" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">2nd Button Link</label>
              <input value={form.cta2_link ?? ''} onChange={field('cta2_link')} placeholder="/products?category=keto" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Image URL (Supabase Storage)</label>
              <input value={form.image_url ?? ''} onChange={field('image_url')} placeholder="https://..." className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          {/* Preview */}
          <div
            className="mt-5 p-6 relative overflow-hidden"
            style={{ background: form.bg_color, minHeight: 120 }}
          >
            <div className="text-[10px] tracking-[2px] font-bold text-gray-400 uppercase mb-2">PREVIEW</div>
            {form.badge && (
              <div className="inline-block bg-primary text-white text-[10px] font-bold tracking-[2px] px-2 py-1 mb-2">{form.badge}</div>
            )}
            <div className="font-display text-white text-3xl leading-none mb-2">
              {form.title.split('|').map((line, i) => (
                <span key={i} className={`block ${i === 1 ? 'text-primary' : 'text-white'}`}>{line}</span>
              ))}
            </div>
            {form.subtitle && <p className="text-gray-400 text-xs max-w-xs">{form.subtitle}</p>}
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
              {saving ? 'SAVING...' : editing ? 'UPDATE BANNER' : 'CREATE BANNER'}
            </button>
            <button onClick={() => setEditing(undefined as any)} className="bg-white text-dark border border-dark px-6 py-2.5 text-sm font-bold hover:bg-gray-light transition-colors">
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Banners list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white border border-gray-border p-12 text-center">
          <div className="flex justify-center mb-4 text-gray-300"><ImageIcon size={64} strokeWidth={1} /></div>
          <h3 className="font-display text-2xl text-dark mb-2">NO BANNERS YET</h3>
          <p className="text-gray-400 text-sm">Create your first hero banner above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white border border-gray-border flex flex-col sm:flex-row overflow-hidden">
              {/* Mini preview */}
              <div
                className="sm:w-48 h-24 flex-shrink-0 flex items-center justify-center p-4"
                style={{ background: banner.bg_color }}
              >
                <div className="font-display text-white text-sm text-center leading-tight">
                  {banner.title.split('|').map((line, i) => (
                    <span key={i} className={`block ${i === 1 ? 'text-primary' : 'text-white'}`}>{line}</span>
                  ))}
                </div>
              </div>

              <div className="flex-1 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  {banner.badge && (
                    <div className="inline-block bg-primary text-white text-[9px] font-bold px-2 py-0.5 mb-1">{banner.badge}</div>
                  )}
                  <div className="font-bold text-sm text-dark">{banner.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{banner.subtitle}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Sort: #{banner.sort_order}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`text-xs font-bold px-3 py-1.5 transition-colors ${
                      banner.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {banner.is_active ? '✓ Active' : '○ Inactive'}
                  </button>
                  <button onClick={() => openEdit(banner)} className="bg-dark text-white text-xs font-bold px-3 py-1.5 hover:bg-dark-2 transition-colors">
                    EDIT
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="bg-white text-primary border border-primary text-xs font-bold px-3 py-1.5 hover:bg-primary hover:text-white transition-colors">
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
