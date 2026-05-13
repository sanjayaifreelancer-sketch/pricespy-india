'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminGetAllCategories, adminDeleteCategory } from '@/lib/admin-db'
import type { Category } from '@/types'
import { Tags, Plus, Edit3, Trash2, AlertCircle } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const cats = await adminGetAllCategories()
    setCategories(cats)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in this category will also be deleted.')) return
    setDeleting(id)
    try {
      await adminDeleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch { alert('Failed to delete') }
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface">Categories</h1>
          <p className="text-[14px] text-on-surface-variant mt-1">{categories.length} categories total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <Tags size={40} className="text-on-surface-variant/30 mx-auto mb-3" />
          <p className="text-[15px] text-on-surface-variant">No categories yet</p>
          <Link href="/admin/categories/new" className="text-[13px] text-primary font-medium mt-1 inline-block hover:opacity-70">Add your first category</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px] text-primary">{cat.icon || 'shopping_bag'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/categories/edit?id=${cat.id}`} className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                    <Edit3 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleting === cat.id}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-colors disabled:opacity-50"
                  >
                    {deleting === cat.id ? (
                      <div className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
              <h3 className="text-[16px] font-semibold text-on-surface mb-0.5">{cat.name}</h3>
              <p className="text-[12px] text-on-surface-variant line-clamp-2">{cat.description || 'No description'}</p>
              <p className="text-[11px] text-on-surface-variant mt-2">/{cat.slug}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
