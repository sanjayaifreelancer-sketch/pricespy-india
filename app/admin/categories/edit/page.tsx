'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { adminGetAllCategories, adminUpdateCategory } from '@/lib/admin-db'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

function EditCategoryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', icon: 'shopping_bag', description: '', image_url: '' })

  const iconOptions = [
    'smartphone', 'laptop_mac', 'headphones', 'checkroom', 'kitchen',
    'spa', 'camera_alt', 'watch', 'shopping_bag', 'tv', 'chair',
    'sports_esports', 'book', 'music_note', 'pet_supplies',
  ]

  useEffect(() => {
    if (!id) { setLoading(false); return }
    adminGetAllCategories().then(cats => {
      const cat = cats.find(c => c.id === id)
      if (cat) {
        setForm({
          name: cat.name || '',
          slug: cat.slug || '',
          icon: cat.icon || 'shopping_bag',
          description: cat.description || '',
          image_url: (cat as any).image_url || '',
        })
      }
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError('')
    try {
      await adminUpdateCategory(id, form)
      router.push('/admin/categories')
    } catch (err: any) {
      setError(err.message || 'Failed to update category')
    }
    setSaving(false)
  }

  if (!id) {
    return (
      <div className="text-center py-20">
        <p className="text-[15px] text-on-surface-variant">No category ID specified</p>
        <Link href="/admin/categories" className="text-primary mt-2 inline-block">Back to categories</Link>
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
    <div className="max-w-lg">
      <Link href="/admin/categories" className="inline-flex items-center gap-1.5 text-[13px] text-on-surface-variant hover:text-primary transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to categories
      </Link>

      <h1 className="text-[24px] font-bold text-on-surface mb-8">Edit Category</h1>

      {error && (
        <div className="text-[13px] mb-6 p-3 rounded-xl bg-error-container/50 text-error">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" required />
        </div>
        <div>
          <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Slug</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" required />
        </div>
        <div>
          <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Icon</label>
          <div className="flex flex-wrap gap-2">
            {iconOptions.map(ico => (
              <button key={ico} type="button" onClick={() => setForm(f => ({ ...f, icon: ico }))} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${form.icon === ico ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'}`}>
                <span className="material-symbols-outlined text-[20px]">{ico}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
        </div>
        <div>
          <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Image URL</label>
          <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
        </div>
        <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl text-[14px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? (
            <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> Saving...</>
          ) : (
            <><Save size={18} /> Update Category</>
          )}
        </button>
      </form>
    </div>
  )
}

export default function EditCategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <EditCategoryForm />
    </Suspense>
  )
}
