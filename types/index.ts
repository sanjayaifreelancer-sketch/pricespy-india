export interface Product {
  id: string
  name: string
  slug: string
  category_id?: string
  category: string
  brand: string
  image_url: string
  images: string[]
  video_url: string
  description: string
  specs: Record<string, string>
  featured: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface Price {
  id: string
  product_id: string
  platform: 'amazon' | 'flipkart' | 'meesho' | 'myntra' | 'croma'
  price: number
  original_price: number
  discount_percent: number
  affiliate_link: string
  in_stock: boolean
  last_updated: string
}

export interface PriceHistory {
  id: string
  product_id: string
  platform: string
  price: number
  recorded_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
}

export interface PriceAlert {
  id: string
  product_id: string
  email: string
  target_price: number
  is_active: boolean
  created_at: string
}

export type Platform = 'amazon' | 'flipkart' | 'meesho' | 'myntra' | 'croma'

export const platformConfig: Record<Platform, { label: string; color: string; bg: string }> = {
  amazon:   { label: 'Amazon',   color: '#FF9900', bg: '#FFF3E0' },
  flipkart: { label: 'Flipkart', color: '#2874F0', bg: '#E3F0FF' },
  meesho:   { label: 'Meesho',   color: '#9C27B0', bg: '#F3E5F5' },
  myntra:   { label: 'Myntra',   color: '#FF3F6C', bg: '#FFE4EC' },
  croma:    { label: 'Croma',    color: '#008000', bg: '#E8F5E9' },
}

export interface SampleProduct {
  name: string
  slug: string
  category: string
  brand: string
  description: string
  image_url?: string
  images?: string[]
  video_url?: string
  specs?: Record<string, string>
  rating: number
  review_count: number
  prices: Partial<Record<Platform, { price: number; original: number; link: string; in_stock?: boolean }>>
}

export interface AdminStats {
  totalProducts: number
  totalCategories: number
  totalPlatforms: number
  totalPrices: number
  recentProducts: Product[]
}
