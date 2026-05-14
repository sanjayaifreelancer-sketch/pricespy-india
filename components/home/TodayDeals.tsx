'use client'

import { useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import { useProducts } from '@/lib/useProducts'

export default function TodayDeals() {
  const [filter, setFilter] = useState('All')
  const { products } = useProducts()
  const filtered = filter === 'All'
    ? products.slice(0, 3)
    : products.filter(p => p.prices[filter.toLowerCase() as keyof typeof p.prices]).slice(0, 3)

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-on-surface tracking-tight">Today&apos;s Best Deals</h2>
        <div className="flex bg-surface-container-low p-1 rounded-xl gap-0.5">
          {['All', 'Amazon', 'Flipkart'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                filter === tab
                  ? 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}
