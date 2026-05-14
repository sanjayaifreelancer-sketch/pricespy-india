import { supabase } from './supabase'
import type { Product, Category, Price, Platform } from '@/types'

// ── Auth Guard ──────────────────────────────────────────
export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()
  if (error) return false
  return !!data
}

// ── Products ────────────────────────────────────────────
export async function adminGetAllProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, prices(*)')
    .order('created_at', { ascending: false })
  return (data as any) || []
}

export async function adminGetProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as any
}

export async function adminCreateProduct(product: {
  name: string; slug: string; category_id: string; brand: string
  description: string; image_url: string; images: string[]; video_url: string
  specs: Record<string, string>; featured: boolean
}) {
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...product, specs: JSON.stringify(product.specs), images: JSON.stringify(product.images) }])
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function adminUpdateProduct(id: string, product: Partial<{
  name: string; slug: string; category_id: string; brand: string
  description: string; image_url: string; images: string[]; video_url: string
  specs: Record<string, string>; featured: boolean
}>) {
  const payload: any = { ...product }
  if (product.specs) payload.specs = JSON.stringify(product.specs)
  if (product.images) payload.images = JSON.stringify(product.images)
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function adminDeleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── Prices ──────────────────────────────────────────────
export async function adminUpsertPrice(price: {
  product_id: string; platform: Platform; price: number
  original_price: number; affiliate_link: string; in_stock: boolean
}) {
  const { data, error } = await supabase
    .from('prices')
    .upsert([price], { onConflict: 'product_id,platform' })
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function adminDeletePrice(id: string) {
  const { error } = await supabase
    .from('prices')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── Categories ──────────────────────────────────────────
export async function adminGetAllCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  return (data as any) || []
}

export async function adminCreateCategory(cat: {
  name: string; slug: string; icon: string; description: string; image_url?: string
}) {
  const { data, error } = await supabase
    .from('categories')
    .insert([cat])
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function adminUpdateCategory(id: string, cat: Partial<{
  name: string; slug: string; icon: string; description: string; image_url: string
}>) {
  const { data, error } = await supabase
    .from('categories')
    .update(cat)
    .eq('id', id)
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function adminDeleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── Stats ────────────────────────────────────────────────
export async function adminGetStats() {
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
  const { count: totalPrices } = await supabase
    .from('prices')
    .select('*', { count: 'exact', head: true })

  const { data: recentProducts } = await supabase
    .from('products')
    .select('*, prices(*)')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalProducts: totalProducts || 0,
    totalCategories: totalCategories || 0,
    totalPrices: totalPrices || 0,
    recentProducts: (recentProducts as any) || [],
  }
}
