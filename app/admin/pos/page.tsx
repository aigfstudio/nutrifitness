'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/types'
import Image from 'next/image'
import { Search, Camera, Package, ShoppingCart, Printer } from 'lucide-react'

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoiceData, setInvoiceData] = useState<any>(null)
  
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredProducts(products)
    } else {
      const lowerSearch = search.toLowerCase()
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerSearch) ||
            (p.sku && p.sku.toLowerCase().includes(lowerSearch))
        )
      )
    }
  }, [search, products])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('name')
    if (data) {
      setProducts(data as Product[])
      setFilteredProducts(data as Product[])
    }
    setLoading(false)
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setSearch('') // Clear search after adding to allow quick next scan
    searchInputRef.current?.focus()
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // If there's an exact SKU match, add it to cart
      const exactMatch = products.find((p) => p.sku?.toLowerCase() === search.toLowerCase())
      if (exactMatch) {
        addToCart(exactMatch)
      } else if (filteredProducts.length === 1) {
        addToCart(filteredProducts[0])
      }
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.08 // Example 8% tax
  const total = subtotal + tax

  const handleCheckout = async () => {
    if (cart.length === 0) return

    const orderData = {
      order_number: 'POS-' + Math.floor(Math.random() * 900000 + 100000),
      items: cart.map(c => ({
        product_id: c.product.id,
        product_name: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        sku: c.product.sku
      })),
      subtotal,
      total,
      status: 'delivered', // POS orders are instantly delivered
      notes: 'POS Sale'
    }

    // Process order in db
    const { error } = await supabase.from('orders').insert([orderData])
    
    if (!error) {
      // Update stock quantities
      for (const item of cart) {
        const newStock = Math.max(0, (item.product.stock_quantity || 0) - item.quantity)
        await supabase.from('products').update({ stock_quantity: newStock }).eq('id', item.product.id)
      }
      
      setInvoiceData({ ...orderData, date: new Date().toLocaleString(), tax })
      setShowInvoice(true)
      setCart([])
      fetchProducts() // Refresh stock
    } else {
      alert('Error creating order: ' + error.message)
    }
  }

  const printInvoice = () => {
    window.print()
  }

  const updateProductStock = async (id: string, newStock: number) => {
    const { error } = await supabase.from('products').update({ stock_quantity: newStock }).eq('id', id)
    if (!error) {
      fetchProducts()
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] gap-6 -m-6 p-6 bg-gray-light overflow-hidden">
      {/* Left Pane - Products */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-border overflow-hidden">
        <div className="p-4 border-b border-gray-border bg-gray-50 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products or scan barcode/QR (SKU)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              autoFocus
            />
          </div>
          <button 
            onClick={() => { searchInputRef.current?.focus() }}
            className="px-4 py-3 bg-dark text-white rounded-lg font-bold flex items-center gap-2 hover:bg-dark-2 transition-colors"
          >
            <Camera size={20} /> Scan QR
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-primary hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                    {product.images && product.images[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                      <Package size={40} className="text-gray-300" />
                    )}
                  </div>
                  <div className="font-bold text-sm text-dark line-clamp-2 leading-tight flex-1">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{product.sku}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="font-bold text-primary">CHF {product.price.toFixed(2)}</div>
                    <div 
                      className={`text-xs px-2 py-1 rounded-full ${
                        (product.stock_quantity || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        const newStock = prompt('Enter new stock quantity:', String(product.stock_quantity || 0))
                        if (newStock !== null) updateProductStock(product.id, parseInt(newStock) || 0)
                      }}
                    >
                      Stock: {product.stock_quantity || 0}
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500">
                  No products found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane - Cart */}
      <div className="w-96 bg-white rounded-xl shadow-sm border border-gray-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-border bg-dark text-white flex justify-between items-center">
          <h2 className="font-display text-lg tracking-wide">Current Order</h2>
          <button 
            onClick={() => setCart([])}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingCart size={64} className="text-gray-300" strokeWidth={1} />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-dark truncate">{item.product.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">CHF {item.product.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 p-1">
                  <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded">-</button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded">+</button>
                </div>
                <div className="font-bold text-sm w-16 text-right">
                  CHF {(item.product.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-border bg-gray-50 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>CHF {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax (8%)</span>
            <span>CHF {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-dark pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>CHF {total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            Checkout & Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && invoiceData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden pos-invoice-modal">
            {/* Printable Area */}
            <div className="p-8 overflow-y-auto" id="printable-invoice">
              <div className="text-center mb-6 border-b border-gray-200 pb-6">
                <h1 className="font-display text-2xl font-bold tracking-wider">NUTRIFITNESS</h1>
                <p className="text-gray-500 text-sm mt-1">GmbH Switzerland</p>
                <div className="mt-4 text-sm space-y-1 text-gray-600">
                  <p>Order: {invoiceData.order_number}</p>
                  <p>Date: {invoiceData.date}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500">
                      <th className="pb-2 font-normal">Item</th>
                      <th className="pb-2 font-normal text-center">Qty</th>
                      <th className="pb-2 font-normal text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoiceData.items.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="py-3 pr-2">
                          <div className="font-bold text-dark">{item.product_name}</div>
                          <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                        </td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">CHF {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>CHF {invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>CHF {invoiceData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-dark pt-2">
                  <span>Total</span>
                  <span>CHF {invoiceData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
                <p>Thank you for shopping with NutriFitness!</p>
                <p className="mt-1">nutrifitness.ch</p>
              </div>
            </div>

            {/* Actions (Not printed) */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 print:hidden">
              <button 
                onClick={() => setShowInvoice(false)}
                className="flex-1 py-2 px-4 bg-white border border-gray-300 text-dark font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={printInvoice}
                className="flex-1 py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Print Receipt
              </button>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-invoice, #printable-invoice * {
                  visibility: visible;
                }
                #printable-invoice {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  padding: 20px;
                  background: white;
                }
              }
            `}} />
          </div>
        </div>
      )}
    </div>
  )
}
