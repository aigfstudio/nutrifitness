export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  badge: string | null
  cta_text: string | null
  cta_link: string | null
  cta2_text: string | null
  cta2_link: string | null
  bg_color: string
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PromoMessage {
  id: string
  text: string
  link: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  abbr: string | null
  bg_color: string
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  sku: string | null
  name: string
  brand: string | null
  slug: string
  description_short: string | null
  description_long: string | null
  category: string | null
  subcategory: string | null
  price: number
  price_original: number | null
  currency: string
  weight_g: number | null
  flavors: string[] | null
  images: string[] | null
  in_stock: boolean
  stock_quantity: number
  is_featured: boolean
  is_new: boolean
  badge_text: string | null
  badge_color: string
  rating: number
  review_count: number
  tags: string[] | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Offer {
  id: string
  name: string
  offer_type: 'bogo' | 'percentage' | 'fixed'
  discount_value: number | null
  product_id: string | null
  category: string | null
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  address: Json | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  items: CartItem[]
  subtotal: number
  shipping_cost: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  shipping_address: ShippingAddress | null
  billing_address: ShippingAddress | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: string
  product_name: string
  product_slug: string
  product_image: string | null
  brand: string | null
  price: number
  quantity: number
  flavor: string | null
}

export interface ShippingAddress {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  postal_code: string
  country: string
  phone?: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}
