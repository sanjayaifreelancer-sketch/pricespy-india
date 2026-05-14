'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import ProductCard from '@/components/product/ProductCard'
import { useProducts } from '@/lib/useProducts'
import { Package } from 'lucide-react'

export default function ProductsPage() {
  const { products: allProducts } = useProducts()
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allProducts.map(p => p.category)))
    return ['All', ...cats.sort()]
  }, [allProducts])

  const filtered = category === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === category)

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-28 px-margin-mobile md:px-margin-tablet max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Package size={24} className="text-primary" />
          <h1 className="text-[28px] font-bold text-on-surface tracking-tight">All Products</h1>
        </div>
        <p className="text-[15px] text-on-surface-variant mb-8">{allProducts.length} products across {categories.length - 1} categories.</p>

        {/* Category Chips */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all capitalize ${
                category === cat
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
