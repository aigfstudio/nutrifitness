'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Offer, Product } from '@/lib/types'

const EMPTY = {
  name: '', offer_type: 'percentage' as const,
  discount_value: 0, product_id: null as string | null,
  category: '', is_active: true, start_date: '', end_date: '',
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Offer | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('offers').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('id, name, slug').order('name'),
    ]).then(([{ data: o }, { data: p }]) => {
      setOffers((o ?? []) as Offer[])
      setProducts((p ?? []) as Product[])
      setLoading(false)
    })
  }, [])

  const fetchOffers = async () => {
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false })
    setOffers((data ?? []) as Offer[])
  }

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }

  const openEdit = (offer: Offer) => {
    setEditing(offer)
    setForm({
      name: offer.name,
      offer_type: offer.offer_type,
      discount_value: offer.discount_value ?? 0,
      product_id: offer.product_id,
      category: offer.category ?? '',
      is_active: offer.is_active,
      start_date: offer.start_date ? new Date(offer.start_date).toISOString().slice(0, 16) : '',
      end_date: offer.end_date ? new Date(offer.end_date).toISOString().slice(0, 16) : '',
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    const payload = {
      ...form,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      product_id: form.product_id || null,
      category: form.category || null,
    }
    if (editing) {
      const { error } = await supabase.from('offers').update(payload).eq('id', editing.id)
      if (error) toast.error(error.message)
      else { toast.success('Offer updated!'); fetchOffers() }
    } else {
      const { error } = await supabase.from('offers').insert(payload)
      if (error) toast.error(error.message)
      else { toast.success('Offer created!'); fetchOffers() }
    }
    setSaving(false)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return
    await supabase.from('offers').delete().eq('id', id)
    toast.success('Deleted')
    fetchOffers()
  }

  const toggleActive = async (offer: Offer) => {
    await supabase.from('offers').update({ is_active: !offer.is_active }).eq('id', offer.id)
    fetchOffers()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-dark tracking-wide">OFFERS & DEALS</h1>
          <p className="text-sm text-gray-400 mt-1">Create BOGO, percentage, and fixed-amount discounts for specific products or categories.</p>
        </div>
        <button onClick={openNew} className="bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary-dark transition-colors">
          + CREATE OFFER
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-border p-6">
          <h2 className="font-bold text-dark mb-4">{editing ? 'EDIT OFFER' : 'NEW OFFER'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Offer Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Summer BOGO Deal" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Offer Type</label>
              <select value={form.offer_type} onChange={e => setForm(p => ({ ...p, offer_type: e.target.value as any }))} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white">
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed">Fixed Amount (CHF)</option>
                <option value="bogo">BOGO (Buy One Get One)</option>
              </select>
            </div>
            {form.offer_type !== 'bogo' && (
              <div>
                <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">
                  {form.offer_type === 'percentage' ? 'Discount (%)' : 'Discount (CHF)'}
                </label>
                <input type="number" step={form.offer_type === 'percentage' ? '1' : '0.01'} value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: Number(e.target.value) }))} placeholder={form.offer_type === 'percentage' ? '25' : '10.00'} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Apply to Product <span className="font-normal text-gray-400">(or leave blank for category)</span></label>
              <select value={form.product_id ?? ''} onChange={e => setForm(p => ({ ...p, product_id: e.target.value || null }))} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white">
                <option value="">All products / Category</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Apply to Category <span className="font-normal text-gray-400">(if no specific product)</span></label>
              <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Protein" className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Start Date</label>
              <input type="datetime-local" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">End Date</label>
              <input type="datetime-local" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} className="w-full border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="offer-active" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="offer-active" className="text-sm font-semibold text-dark cursor-pointer">Active</label>
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

      {/* Offers list */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : offers.length === 0 ? (
        <div className="bg-white border border-gray-border p-12 text-center">
          <div className="text-5xl mb-4">🏷</div>
          <h3 className="font-display text-2xl text-dark mb-2">NO OFFERS YET</h3>
          <p className="text-gray-400 text-sm">Create your first deal to boost sales.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-light border-b border-gray-border">
              <tr>
                {['Offer', 'Type', 'Value', 'Applies To', 'Dates', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-black tracking-wider text-gray-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-border">
              {offers.map(offer => (
                <tr key={offer.id} className="hover:bg-gray-light/30 transition-colors">
                  <td className="px-5 py-3 font-semibold text-dark">{offer.name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-1 ${offer.offer_type === 'bogo' ? 'bg-green-100 text-green-700' : offer.offer_type === 'percentage' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {offer.offer_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-dark">
                    {offer.offer_type === 'bogo' ? 'Buy 1 Get 1' : offer.offer_type === 'percentage' ? `${offer.discount_value}%` : `CHF ${offer.discount_value}`}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {offer.product_id ? products.find(p => p.id === offer.product_id)?.name ?? 'Specific Product' : offer.category || 'All Products'}
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {offer.start_date ? new Date(offer.start_date).toLocaleDateString('en-CH') : '—'} to {offer.end_date ? new Date(offer.end_date).toLocaleDateString('en-CH') : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleActive(offer)} className={`text-[10px] font-bold px-2 py-1 transition-colors ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {offer.is_active ? '✓ Active' : '○ Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(offer)} className="bg-dark text-white text-xs font-bold px-3 py-1.5 hover:bg-dark-2 transition-colors">EDIT</button>
                      <button onClick={() => handleDelete(offer.id)} className="bg-white text-primary border border-primary text-xs font-bold px-3 py-1.5 hover:bg-primary hover:text-white transition-colors">DELETE</button>
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
