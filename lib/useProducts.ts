'use client'

import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { sampleProducts, getProductImage } from './utils'
import type { SampleProduct, Platform } from '@/types'

let catCache: Record<string, string> | null = null
let catPromise: Promise<Record<string, string>> | null = null

async function getCategoryMap(): Promise<Record<string, string>> {
  if (catCache) return catCache
  if (!catPromise) {
    catPromise = (async () => {
      const { data } = await supabase.from('categories').select('id, slug')
      const map: Record<string, string> = {}
      for (const c of data || []) map[c.id] = c.slug
      catCache = map
      return map
    })()
  }
  return catPromise
}

async function mapToSample(products: any[]): Promise<SampleProduct[]> {
  if (!products?.length) return []

  const catMap = await getCategoryMap()
  const catIdToSlug: Record<string, string> = {}

  if (typeof products[0].category_id === 'string') {
    const ids = [...new Set(products.map((p: any) => p.category_id).filter(Boolean))]
    if (ids.length > 0) {
      const { data: cats } = await supabase.from('categories').select('id, slug').in('id', ids)
      for (const c of cats || []) catIdToSlug[c.id] = c.slug
    }
  }

  return products.map((p: any) => {
    const catSlug = catIdToSlug[p.category_id] || catMap[p.category_id] || 'accessories'
    const prices: Partial<Record<Platform, { price: number; original: number; link: string }>> = {}

    if (Array.isArray(p.prices)) {
      for (const pr of p.prices) {
        prices[pr.platform as Platform] = {
          price: pr.price,
          original: pr.original_price,
          link: pr.affiliate_link || '#',
        }
      }
    }

    return {
      name: p.name,
      slug: p.slug,
      category: catSlug,
      brand: p.brand,
      description: p.description || '',
      rating: p.rating ?? 4.0,
      review_count: p.review_count ?? 0,
      specs: p.specs ?? {},
      prices,
      image_url: p.image_url || undefined,
    }
  })
}

export function useProducts() {
  const [products, setProducts] = useState<SampleProduct[]>(sampleProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        setLoading(true)
        const { data } = await supabase
          .from('products')
          .select('*, prices(*)')
          .order('created_at', { ascending: false })
        if (cancelled) return

        if (data && data.length > 0) {
          const mapped = await mapToSample(data)
          if (!cancelled) setProducts(mapped.length > 0 ? mapped : sampleProducts)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to fetch')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  return { products, loading, error }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<SampleProduct | null>(() => {
    return sampleProducts.find(p => p.slug === slug) || null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        setLoading(true)
        const { data } = await supabase
          .from('products')
          .select('*, prices(*)')
          .eq('slug', slug)
          .single()
        if (cancelled) return
        if (data) {
          const mapped = await mapToSample([data])
          if (!cancelled && mapped[0]) setProduct(mapped[0])
        }
      } catch {
        // fallback to sample already set
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [slug])

  return { product, loading }
}

export function useProductsByCategory(categorySlug: string) {
  const { products, loading } = useProducts()
  const filtered = products.filter(p => p.category === categorySlug)
  return { products: filtered, loading }
}
