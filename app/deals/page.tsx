'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import ProductCard from '@/components/product/ProductCard'
import { useProducts } from '@/lib/useProducts'
import { Tag, Zap } from 'lucide-react'

export default function DealsPage() {
  const [filter, setFilter] = useState('All')
  const { products: allProducts } = useProducts()

  const filters = ['All', 'Amazon', 'Flipkart', 'Meesho', 'Under ₹2000']
  const filtered = filter === 'All'
    ? allProducts
    : filter === 'Under ₹2000'
      ? allProducts.filter(p => Math.min(...Object.values(p.prices).map(x => x.price)) < 2000)
      : allProducts.filter(p => p.prices[filter.toLowerCase() as keyof typeof p.prices])

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-28 px-margin-mobile md:px-margin-tablet max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Zap size={24} className="text-primary" />
          <h1 className="text-[28px] font-bold text-on-surface tracking-tight">Best Deals</h1>
        </div>
        <p className="text-[15px] text-on-surface-variant mb-8">Hand-picked deals across top stores, updated daily.</p>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f === 'Under ₹2000' && <Tag size={14} className="inline mr-1" />}
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[15px] text-on-surface-variant">No deals found for this filter.</p>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  )
}
