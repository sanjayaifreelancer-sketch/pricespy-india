'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminGetAllProducts, adminDeleteProduct } from '@/lib/admin-db'
import { getCategories } from '@/lib/db'
import type { Product, Category } from '@/types'
import { Package, Plus, Edit3, Trash2, Search, AlertTriangle } from 'lucide-react'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deletingAll, setDeletingAll] = useState(false)

  const load = async () => {
    setLoading(true)
    const [prods, cats] = await Promise.all([adminGetAllProducts(), getCategories()])
    setProducts(prods)
    setCategories(cats)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const cats = Array.isArray(categories) ? categories : []
  const prods = Array.isArray(products) ? products : []
  const categoryMap = new Map(cats.map(c => [c.id, c]))

  const filtered = prods.filter(p => {
    if (!p) return false
    if (!search) return true
    const n = (p.name || '').toLowerCase()
    const b = (p.brand || '').toLowerCase()
    return n.includes(search.toLowerCase()) || b.includes(search.toLowerCase())
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    try {
      await adminDeleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch { alert('Failed to delete. Make sure DELETE RLS policy exists on products table.') }
    setDeleting(null)
  }

  const handleDeleteAll = async () => {
    if (!confirm(`Delete ALL ${products.length} products? This cannot be undone.`)) return
    setDeletingAll(true)
    try {
      for (const p of products) {
        await adminDeleteProduct(p.id)
      }
      setProducts([])
      alert('All products deleted.')
    } catch { alert('Failed to delete all. Make sure DELETE RLS policy exists on products table.') }
    setDeletingAll(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface">Products</h1>
          <p className="text-[14px] text-on-surface-variant mt-1">{products.length} products total</p>
        </div>
        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="flex items-center gap-2 bg-error/10 text-error px-4 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-error/20 transition-all disabled:opacity-50"
            >
              {deletingAll ? (
                <><div className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 size={16} /> Delete All</>
              )}
            </button>
          )}
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package size={40} className="text-on-surface-variant/30 mx-auto mb-3" />
          <p className="text-[15px] text-on-surface-variant">No products found</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/30 text-[12px] font-medium text-on-surface-variant uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">Product</th>
                  <th className="text-left px-5 py-3.5">Category</th>
                  <th className="text-left px-5 py-3.5">Brand</th>
                  <th className="text-left px-5 py-3.5">Featured</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filtered.map(p => {
                  const cat = categoryMap.get(p.category_id)
                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 overflow-hidden">
                            {p.image_url ? (
                              <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package size={18} className="text-on-surface-variant" />
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-on-surface">{p.name}</p>
                            <p className="text-[11px] text-on-surface-variant">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-on-surface-variant">{cat?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-[13px] text-on-surface-variant">{p.brand}</td>
                      <td className="px-5 py-3.5">
                        {p.featured ? (
                          <span className="text-[11px] font-medium text-apple-green bg-apple-green/10 px-2 py-0.5 rounded-full">Yes</span>
                        ) : (
                          <span className="text-[11px] text-on-surface-variant">No</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/products/edit?id=${p.id}`}
                            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deleting === p.id}
                            className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-colors disabled:opacity-50"
                          >
                            {deleting === p.id ? (
                              <div className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
