'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminCreateCategory } from '@/lib/admin-db'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewCategoryPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', icon: 'shopping_bag', description: '', image_url: '' })

  const generateSlug = (name: string) => {
    setForm(f => ({ ...f, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))
  }

  const iconOptions = [
    'smartphone', 'laptop_mac', 'headphones', 'checkroom', 'kitchen',
    'spa', 'camera_alt', 'watch', 'shopping_bag', 'tv', 'chair',
    'sports_esports', 'book', 'music_note', 'pet_supplies',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminCreateCategory(form)
      router.push('/admin/categories')
    } catch (err: any) {
      setError(err.message || 'Failed to create category')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-lg">
      <Link href="/admin/categories" className="inline-flex items-center gap-1.5 text-[13px] text-on-surface-variant hover:text-primary transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to categories
      </Link>

      <h1 className="text-[24px] font-bold text-on-surface mb-8">New Category</h1>

      {error && (
        <div className="text-[13px] mb-6 p-3 rounded-xl bg-error-container/50 text-error">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Name</label>
          <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); generateSlug(e.target.value) }} placeholder="Category name" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" required />
        </div>
        <div>
          <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Slug</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="category-slug" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" required />
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
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Short description" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
        </div>
        <div>
          <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Image URL (optional)</label>
          <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://example.com/category.jpg" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl text-[14px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> Creating...</>
          ) : (
            <><Save size={18} /> Create Category</>
          )}
        </button>
      </form>
    </div>
  )
}
