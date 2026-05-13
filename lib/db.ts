import { supabase } from './supabase'
import type { Product, Price, PriceHistory, Category, PriceAlert, Platform, SampleProduct } from '@/types'

// Products
export async function getAllProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, prices(*)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('slug', slug)
    .single()
  return data
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('category_id', supabase.rpc('get_category_id', { slug: categorySlug }))
  return data || []
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('featured', true)
    .limit(8)
  return data || []
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, prices(*)')
    .ilike('name', `%${query}%`)
    .limit(20)
  return data || []
}

// Prices
export async function getPricesForProduct(productId: string): Promise<Price[]> {
  const { data } = await supabase
    .from('prices')
    .select('*')
    .eq('product_id', productId)
  return data || []
}

export async function getBestPriceForProduct(productId: string): Promise<Price | null> {
  const { data } = await supabase
    .from('prices')
    .select('*')
    .eq('product_id', productId)
    .eq('in_stock', true)
    .order('price', { ascending: true })
    .limit(1)
    .single()
  return data
}

// Price History
export async function getPriceHistory(productId: string, days: number = 90): Promise<PriceHistory[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data } = await supabase
    .from('price_history')
    .select('*')
    .eq('product_id', productId)
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: true })
  return data || []
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

// Price Alerts
export async function createPriceAlert(alert: {
  email: string
  product_id: string
  target_price: number
  user_id?: string
}): Promise<PriceAlert | null> {
  const { data } = await supabase
    .from('price_alerts')
    .insert([alert])
    .select()
    .single()
  return data
}

export async function getUserAlerts(userId: string): Promise<PriceAlert[]> {
  const { data } = await supabase
    .from('price_alerts')
    .select('*, products(name, slug, image_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function toggleAlert(alertId: string, isActive: boolean): Promise<void> {
  await supabase
    .from('price_alerts')
    .update({ is_active: isActive })
    .eq('id', alertId)
}

export async function deleteAlert(alertId: string): Promise<void> {
  await supabase
    .from('price_alerts')
    .delete()
    .eq('id', alertId)
}

// Wishlist
export async function addToWishlist(userId: string, productId: string): Promise<void> {
  await supabase
    .from('wishlists')
    .insert([{ user_id: userId, product_id: productId }])
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
}

export async function getWishlist(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId)
  return (data || []).map(w => w.product_id)
}
