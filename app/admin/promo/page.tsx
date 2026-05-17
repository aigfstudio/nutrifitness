'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { PromoMessage } from '@/lib/types'

export default function AdminPromoPage() {
  const [promos, setPromos] = useState<PromoMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<PromoMessage | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ text: '', link: '', is_active: true, sort_order: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchPromos() }, [])

  const fetchPromos = async () => {
    const { data } = await supabase.from('promo_messages').select('*').order('sort_order')
    setPromos((data ?? []) as PromoMessage[])
    setLoading(false)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ text: '', link: '', is_active: true, sort_order: promos.length + 1 })
    setShowForm(true)
  }

  const openEdit = (promo: PromoMessage) => {
    setEditing(promo)
    setForm({ text: promo.text, link: promo.link ?? '', is_active: promo.is_active, sort_order: promo.sort_order })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.text.trim()) { toast.error('Text is required'); return }
    setSaving(true)
    const payload = { ...form, link: form.link || null }
    if (editing) {
      const { error } = await supabase.from('promo_messages').update(payload).eq('id', editing.id)
      if (error) toast.error(error.message)
      else { toast.success('Updated!'); fetchPromos() }
    } else {
      const { error } = await supabase.from('promo_messages').insert(payload)
      if (error) toast.error(error.message)
      else { toast.success('Created!'); fetchPromos() }
    }
    setSaving(false)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promo message?')) return
    await supabase.from('promo_messages').delete().eq('id', id)
    toast.success('Deleted')
    fetchPromos()
  }

  const toggleActive = async (promo: PromoMessage) => {
    await supabase.from('promo_messages').update({ is_active: !promo.is_active }).eq('id', promo.id)
    fetchPromos()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-dark tracking-wide">PROMO BAR</h1>
          <p className="text-sm text-gray-400 mt-1">Manage the rotating messages shown at the top of every page.</p>
        </div>
        <button onClick={openNew} className="bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors">
          + ADD MESSAGE
        </button>
      </div>

      {/* Preview */}
      <div className="bg-dark text-white">
        <div className="px-4 py-2 flex items-center justify-center gap-4 flex-wrap">
          {promos.filter(p => p.is_active).map((p, i) => (
            <span key={p.id} className={`text-xs font-semibold ${i > 0 ? 'border-l border-dark-3 pl-4' : ''}`}>
              {p.text}
            </span>
          ))}
          {promos.filter(p => p.is_active).length === 0 && (
            <span className="text-xs text-gray-500">No active promo messages</span>
          )}
        </div>
        <div className="text-center text-[10px] text-gray-600 pb-1">↑ Live promo bar preview</div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-border p-6">
          <h2 className="font-bold text-dark mb-4">{editing ? 'EDIT MESSAGE' : 'NEW MESSAGE'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Message Text *</label>
              <input value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} placeholder="Free Shipping on Orders over CHF 79" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Link (optional)</label>
              <input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} placeholder="/products" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="promo-active" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="promo-active" className="text-sm font-semibold text-dark cursor-pointer">Active</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
              {saving ? 'SAVING...' : editing ? 'UPDATE' : 'CREATE'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-border text-sm font-bold hover:bg-gray-light transition-colors">CANCEL</button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {promos.map(promo => (
            <div key={promo.id} className="bg-white border border-gray-border flex items-center justify-between px-5 py-4 gap-4">
              <div className="flex-1">
                <div className="font-semibold text-dark text-sm">{promo.text}</div>
                {promo.link && <div className="text-xs text-gray-400 mt-0.5">{promo.link}</div>}
                <div className="text-xs text-gray-400 mt-0.5">Order: #{promo.sort_order}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(promo)} className={`text-[10px] font-bold px-2 py-1 transition-colors ${promo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {promo.is_active ? '✓ Active' : '○ Hidden'}
                </button>
                <button onClick={() => openEdit(promo)} className="bg-dark text-white text-xs font-bold px-3 py-1.5 hover:bg-dark-2 transition-colors">EDIT</button>
                <button onClick={() => handleDelete(promo.id)} className="bg-white text-primary border border-primary text-xs font-bold px-3 py-1.5 hover:bg-primary hover:text-white transition-colors">DELETE</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
