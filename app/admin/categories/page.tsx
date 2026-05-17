'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Category } from '@/lib/types'

const EMPTY: Omit<Category, 'id' | 'created_at'> = {
  name: '', slug: '', abbr: '', bg_color: '#1a1a3a',
  image_url: '', sort_order: 0, is_active: true,
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<Omit<Category, 'id' | 'created_at'>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories((data ?? []) as Category[])
    setLoading(false)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY, sort_order: categories.length + 1 })
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    const { id, created_at, ...rest } = cat
    setForm(rest)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.slug.trim()) { toast.error('Slug is required'); return }
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('categories').update(form).eq('id', editing.id)
      if (error) toast.error(error.message)
      else { toast.success('Category updated!'); fetchCategories() }
    } else {
      const { error } = await supabase.from('categories').insert(form)
      if (error) toast.error(error.message)
      else { toast.success('Category created!'); fetchCategories() }
    }
    setSaving(false)
    setShowForm(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return
    await supabase.from('categories').delete().eq('id', id)
    toast.success('Deleted')
    fetchCategories()
  }

  const toggleActive = async (cat: Category) => {
    await supabase.from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id)
    fetchCategories()
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }))
    if (k === 'name' && !form.slug) setForm(prev => ({ ...prev, slug: slugify(e.target.value) }))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-dark tracking-wide">CATEGORIES</h1>
          <p className="text-sm text-gray-400 mt-1">Manage product categories shown on the homepage and filter sidebar.</p>
        </div>
        <button onClick={openNew} className="bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors">
          + ADD CATEGORY
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-border p-6">
          <h2 className="font-bold text-dark mb-4">{editing ? 'EDIT CATEGORY' : 'NEW CATEGORY'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Category Name *</label>
              <input value={form.name} onChange={f('name')} placeholder="Protein" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">URL Slug *</label>
              <input value={form.slug} onChange={f('slug')} placeholder="protein" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Abbreviation <span className="font-normal text-gray-400">(shown in circle)</span></label>
              <input value={form.abbr ?? ''} onChange={f('abbr')} placeholder="PRO" maxLength={5} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Background Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.bg_color} onChange={f('bg_color')} className="h-11 w-14 border border-gray-border p-1 cursor-pointer" />
                <input value={form.bg_color} onChange={f('bg_color')} className="flex-1 border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" id="cat-active" checked={form.is_active} onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="cat-active" className="text-sm font-semibold text-dark cursor-pointer">Active (visible on store)</label>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-5 flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-sm tracking-wider"
              style={{ background: form.bg_color }}
            >
              {form.abbr || '?'}
            </div>
            <div>
              <div className="font-bold text-dark">{form.name || 'Category Name'}</div>
              <div className="text-xs text-gray-400">/products?category={form.slug || 'slug'}</div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
              {saving ? 'SAVING...' : editing ? 'UPDATE' : 'CREATE'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-border text-sm font-bold hover:bg-gray-light transition-colors">
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white border border-gray-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-light border-b border-gray-border">
              <tr>
                {['Category', 'Slug', 'Order', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-black tracking-wider text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-border">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-light/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-black flex-shrink-0"
                        style={{ background: cat.bg_color }}
                      >
                        {cat.abbr}
                      </div>
                      <span className="font-semibold text-dark">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-5 py-3 text-gray-400">#{cat.sort_order}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleActive(cat)} className={`text-[10px] font-bold px-2 py-1 transition-colors ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.is_active ? '✓ Active' : '○ Hidden'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(cat)} className="bg-dark text-white text-xs font-bold px-3 py-1.5 hover:bg-dark-2 transition-colors">EDIT</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="bg-white text-primary border border-primary text-xs font-bold px-3 py-1.5 hover:bg-primary hover:text-white transition-colors">DELETE</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
