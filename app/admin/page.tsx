'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminGetStats } from '@/lib/admin-db'
import type { Product } from '@/types'
import { Package, Tags, CreditCard, ArrowRight, IndianRupee, Eye, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalProducts: number; totalCategories: number; totalPrices: number; recentProducts: any[]
  } | null>(null)

  useEffect(() => {
    adminGetStats().then(setStats)
  }, [])

  const cards = [
    { label: 'Total Products', value: stats?.totalProducts ?? '—', icon: Package, href: '/admin/products', color: 'text-primary bg-primary/10' },
    { label: 'Categories', value: stats?.totalCategories ?? '—', icon: Tags, href: '/admin/categories', color: 'text-apple-orange bg-apple-orange/10' },
    { label: 'Price Entries', value: stats?.totalPrices ?? '—', icon: CreditCard, href: '/admin/products', color: 'text-apple-green bg-apple-green/10' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface">Dashboard</h1>
          <p className="text-[14px] text-on-surface-variant mt-1">Overview of your affiliate store</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
              <ArrowRight size={16} className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[28px] font-bold text-on-surface">{value}</p>
            <p className="text-[13px] text-on-surface-variant mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
          <h2 className="text-[16px] font-semibold text-on-surface">Recent Products</h2>
          <Link href="/admin/products" className="text-[13px] text-primary font-medium hover:opacity-70 transition-opacity">View All</Link>
        </div>
        {stats?.recentProducts?.length ? (
          <div className="divide-y divide-outline-variant/20">
            {stats.recentProducts.map((p: any) => (
              <Link key={p.id} href={`/admin/products/edit?id=${p.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-low transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={18} className="text-on-surface-variant" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-on-surface truncate">{p.name}</p>
                  <p className="text-[12px] text-on-surface-variant">{p.brand}</p>
                </div>
                <Eye size={16} className="text-on-surface-variant shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <IndianRupee size={32} className="text-on-surface-variant/30 mx-auto mb-2" />
            <p className="text-[14px] text-on-surface-variant">No products yet</p>
            <Link href="/admin/products/new" className="text-[13px] text-primary font-medium mt-1 inline-block hover:opacity-70">Add your first product</Link>
          </div>
        )}
      </div>
    </div>
  )
}
