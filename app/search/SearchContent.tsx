'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import ProductCard from '@/components/product/ProductCard'
import { getAllProducts } from '@/lib/utils'
import { Search, X, SlidersHorizontal } from 'lucide-react'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')

  const allProducts = getAllProducts()
  const brands = useMemo(() => Array.from(new Set(allProducts.map(p => p.brand))), [allProducts])

  const results = useMemo(() => {
    let filtered = allProducts
    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand)
    }
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => Math.min(...Object.values(a.prices).map(p => p.price)) - Math.min(...Object.values(b.prices).map(p => p.price)))
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => Math.min(...Object.values(b.prices).map(p => p.price)) - Math.min(...Object.values(a.prices).map(p => p.price)))
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }
    return filtered
  }, [query, sortBy, selectedBrand, allProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-28 px-margin-mobile md:px-margin-tablet max-w-7xl mx-auto">
        <form onSubmit={handleSearch} className="relative max-w-2xl mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-on-surface-variant" />
          </div>
          <input
            className="w-full pl-12 pr-12 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-[17px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            placeholder="Search products, brands, or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface">
              <X size={18} />
            </button>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 text-[13px] text-on-surface-variant font-medium">
            <SlidersHorizontal size={16} /> Filters:
          </div>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30">
            <option value="all">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'name')}
            className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30">
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <span className="text-[13px] text-on-surface-variant ml-auto">{results.length} result{results.length !== 1 ? 's' : ''}</span>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-on-surface-variant" />
            </div>
            <h3 className="text-[17px] font-semibold text-on-surface mb-1">No products found</h3>
            <p className="text-[13px] text-on-surface-variant">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  )
}
