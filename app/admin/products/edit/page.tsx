'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { adminGetProduct, adminUpdateProduct, adminUpsertPrice } from '@/lib/admin-db'
import { getCategories } from '@/lib/db'
import type { Category, Platform } from '@/types'
import { platformConfig, platformGroups } from '@/types'
import { ArrowLeft, Plus, X, Save } from 'lucide-react'
import Link from 'next/link'

function EditProductForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', slug: '', category_id: '', brand: '', description: '',
    image_url: '', video_url: '', featured: false,
  })
  const [images, setImages] = useState<string[]>([])
  const [imageInput, setImageInput] = useState('')
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([])
  const [prices, setPrices] = useState<Partial<Record<Platform, {
    id?: string; price: string; original_price: string; affiliate_link: string; in_stock: boolean
  }>>>({})

  const platforms = Object.keys(platformConfig) as Platform[]
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!id) { setLoading(false); return }
    Promise.all([adminGetProduct(id), getCategories()])
      .then(([product, cats]) => {
        setCategories(cats)
        if (product) {
          setForm({
            name: product.name || '',
            slug: product.slug || '',
            category_id: product.category_id || '',
            brand: product.brand || '',
            description: product.description || '',
            image_url: product.image_url || '',
            video_url: product.video_url || '',
            featured: product.featured || false,
          })
          setImages(product.images || [])
          if (product.specs && typeof product.specs === 'object') {
            setSpecs(Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) })))
          }
          if (product.prices) {
            const priceMap: any = {}
            for (const p of product.prices) {
              priceMap[p.platform] = {
                id: p.id,
                price: String(p.price),
                original_price: String(p.original_price),
                affiliate_link: p.affiliate_link || '',
                in_stock: p.in_stock ?? true,
              }
            }
            setPrices(priceMap)
          }
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to load product')
        setLoading(false)
      })
  }, [id])

  const addImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages(prev => [...prev, imageInput.trim()])
      setImageInput('')
    }
  }

  const addSpec = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError('')

    try {
      const specsObj = specs.reduce((acc, s) => {
        if (s.key.trim()) acc[s.key.trim()] = s.value.trim()
        return acc
      }, {} as Record<string, string>)

      await adminUpdateProduct(id, {
        ...form,
        images,
        specs: specsObj,
      })

      for (const [platform, p] of Object.entries(prices)) {
        if (p && p.price && p.original_price) {
          await adminUpsertPrice({
            product_id: id,
            platform: platform as Platform,
            price: parseInt(p.price),
            original_price: parseInt(p.original_price),
            affiliate_link: p.affiliate_link || '',
            in_stock: p.in_stock ?? true,
          })
        }
      }

      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message || 'Failed to update product')
    }
    setSaving(false)
  }

  if (!id) {
    return (
      <div className="text-center py-20">
        <p className="text-[15px] text-on-surface-variant">No product ID specified</p>
        <Link href="/admin/products" className="text-primary mt-2 inline-block">Back to products</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-[13px] text-on-surface-variant hover:text-primary transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <h1 className="text-[24px] font-bold text-on-surface mb-8">Edit Product</h1>

      {error && (
        <div className="text-[13px] mb-6 p-3 rounded-xl bg-error-container/50 text-error">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 space-y-4">
          <h2 className="text-[16px] font-semibold text-on-surface">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Product Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" required />
            </div>
            <div>
              <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Slug</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" required />
            </div>
            <div>
              <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Brand</label>
              <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" required />
            </div>
            <div>
              <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Category</label>
              <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
            </div>
          </div>
          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/30" />
            <span className="text-[14px] text-on-surface">Featured product</span>
          </label>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 space-y-4">
          <h2 className="text-[16px] font-semibold text-on-surface">Media</h2>
          <div>
            <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Main Image URL</label>
            <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            {form.image_url && (
              <img src={form.image_url} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-xl border border-outline-variant/30" />
            )}
          </div>
          <div>
            <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Video URL</label>
            <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Gallery Images</label>
            <div className="flex gap-2 mb-2">
              <input value={imageInput} onChange={e => setImageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} placeholder="Image URL" className="flex-1 bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <button type="button" onClick={addImage} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[13px] font-medium text-on-surface hover:bg-surface-variant transition-colors">Add</button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg text-[12px] text-on-surface-variant">
                    <span className="truncate max-w-[200px]">{url}</span>
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} className="text-error hover:opacity-70"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 space-y-4">
          <h2 className="text-[16px] font-semibold text-on-surface">Prices &amp; Affiliate Links</h2>
          <div className="space-y-4">
            {platformGroups.map(group => {
              const groupPlatforms = platforms.filter(p => platformConfig[p].group === group)
              if (groupPlatforms.length === 0) return null
              const isCollapsed = collapsedGroups[group]
              return (
                <div key={group} className="bg-surface-container-low rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }))}
                    className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    {group}
                    <span className={`transition-transform ${isCollapsed ? '' : 'rotate-180'}`}>▼</span>
                  </button>
                  {!isCollapsed && (
                    <div className="px-4 pb-3 space-y-3">
                      {groupPlatforms.map(platform => {
                        const cfg = platformConfig[platform]
                        const p = prices[platform]
                        return (
                          <div key={platform} className="rounded-xl p-4 space-y-3" style={{ borderLeft: `3px solid ${cfg.color}`, background: cfg.bg + '30' }}>
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                              <label className="flex items-center gap-1.5 text-[12px] text-on-surface-variant">
                                <input type="checkbox" checked={p?.in_stock ?? true} onChange={e => setPrices(prev => ({ ...prev, [platform]: { ...prev[platform], in_stock: e.target.checked, price: prev[platform]?.price || '', original_price: prev[platform]?.original_price || '', affiliate_link: prev[platform]?.affiliate_link || '' } }))} className="w-3.5 h-3.5" />
                                In Stock
                              </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[11px] text-on-surface-variant mb-1 block">Price (₹)</label>
                                <input type="number" value={p?.price || ''} onChange={e => setPrices(prev => ({ ...prev, [platform]: { ...prev[platform], price: e.target.value, original_price: prev[platform]?.original_price || '', affiliate_link: prev[platform]?.affiliate_link || '', in_stock: prev[platform]?.in_stock ?? true } }))} className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                              </div>
                              <div>
                                <label className="text-[11px] text-on-surface-variant mb-1 block">Original Price (₹)</label>
                                <input type="number" value={p?.original_price || ''} onChange={e => setPrices(prev => ({ ...prev, [platform]: { ...prev[platform], price: prev[platform]?.price || '', original_price: e.target.value, affiliate_link: prev[platform]?.affiliate_link || '', in_stock: prev[platform]?.in_stock ?? true } }))} className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                              </div>
                              <div>
                                <label className="text-[11px] text-on-surface-variant mb-1 block">Affiliate Link</label>
                                <input value={p?.affiliate_link || ''} onChange={e => setPrices(prev => ({ ...prev, [platform]: { ...prev[platform], price: prev[platform]?.price || '', original_price: prev[platform]?.original_price || '', affiliate_link: e.target.value, in_stock: prev[platform]?.in_stock ?? true } }))} className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-on-surface">Specifications</h2>
            <button type="button" onClick={addSpec} className="flex items-center gap-1.5 text-[12px] font-medium text-primary hover:opacity-70 transition-opacity">
              <Plus size={14} /> Add Spec
            </button>
          </div>
          {specs.length === 0 ? (
            <p className="text-[13px] text-on-surface-variant">No specs added yet</p>
          ) : (
            <div className="space-y-2.5">
              {specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s.key} onChange={e => { const next = [...specs]; next[i] = { ...next[i], key: e.target.value }; setSpecs(next) }} placeholder="Key" className="flex-1 bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  <input value={s.value} onChange={e => { const next = [...specs]; next[i] = { ...next[i], value: e.target.value }; setSpecs(next) }} placeholder="Value" className="flex-1 bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  <button type="button" onClick={() => setSpecs(prev => prev.filter((_, j) => j !== i))} className="p-2 text-on-surface-variant hover:text-error transition-colors"><X size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex items-center gap-3 pb-8">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl text-[14px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? (
              <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />Saving...</>
            ) : (
              <><Save size={18} /> Update Product</>
            )}
          </button>
          <Link href="/admin/products" className="px-6 py-3 rounded-xl text-[14px] font-medium text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:bg-surface-container-low transition-all">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <EditProductForm />
    </Suspense>
  )
}
