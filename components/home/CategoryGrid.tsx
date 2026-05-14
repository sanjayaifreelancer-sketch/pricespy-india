'use client'

import Link from 'next/link'
import { categories } from '@/lib/utils'

export default function CategoryGrid() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-on-surface tracking-tight">Shop by Category</h2>
        <Link href="/products" className="text-[14px] font-medium text-primary hover:opacity-70 transition-opacity">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-surface-container-low flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all group-hover:scale-105">
              <span className="material-symbols-outlined text-primary text-[26px] md:text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
            </div>
            <span className="text-[11px] md:text-[12px] text-on-surface-variant group-hover:text-primary transition-colors text-center font-medium leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
