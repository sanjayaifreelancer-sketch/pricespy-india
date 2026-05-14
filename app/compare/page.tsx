'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import { useStore } from '@/lib/store'
import { formatPrice, getProductImage } from '@/lib/utils'
import { useProducts } from '@/lib/useProducts'
import { Platform, platformConfig } from '@/types'
import { X, ShoppingCart, ArrowLeft } from 'lucide-react'

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useStore()
  const { products: allProducts } = useProducts()
  const products = compareList.map(item => allProducts.find(p => p.slug === item.slug)).filter(Boolean)

  if (products.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-28 px-margin-mobile md:px-margin-tablet max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant">compare_arrows</span>
            </div>
            <h2 className="text-[22px] font-semibold text-on-surface mb-2">No products to compare</h2>
            <p className="text-[15px] text-on-surface-variant mb-6">Add products from search or category pages to start comparing.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl text-[15px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all">
              <ShoppingCart size={18} />
              Browse Products
            </Link>
          </div>
        </main>
        <BottomNav />
      </>
    )
  }

  // Get all unique platforms across all products
  const allPlatforms = new Set<Platform>()
  products.forEach(p => {
    if (p) Object.keys(p.prices).forEach(k => allPlatforms.add(k as Platform))
  })

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-28 px-margin-mobile md:px-margin-tablet max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/products" className="inline-flex items-center gap-1 text-[13px] text-on-surface-variant hover:text-primary transition-colors mb-2">
              <ArrowLeft size={16} />
              Back
            </Link>
            <h1 className="text-[28px] font-bold text-on-surface tracking-tight">Compare Products</h1>
            <p className="text-[15px] text-on-surface-variant">{products.length} product{products.length !== 1 ? 's' : ''} selected</p>
          </div>
          <button
            onClick={clearCompare}
            className="text-[13px] text-error hover:opacity-70 transition-opacity font-medium"
          >
            Clear all
          </button>
        </div>

        {/* Compare Table */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="text-left px-5 py-4 text-[13px] font-semibold text-on-surface-variant w-32">Feature</th>
                {products.map((p, i) => p && (
                  <th key={p.slug} className="px-5 py-4 text-center min-w-[200px] relative">
                    <button
                      onClick={() => removeFromCompare(p.slug)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-variant transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <img src={p && getProductImage(p.slug)} alt={p.name} className="h-24 object-contain mx-auto mb-3" />
                    <Link href={`/products/${p.slug}`} className="text-[14px] font-semibold text-on-surface hover:text-primary transition-colors">
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Brand */}
              <tr className="border-b border-outline-variant/10">
                <td className="px-5 py-4 text-[13px] text-on-surface-variant font-medium">Brand</td>
                {products.map((p, i) => p && (
                  <td key={p.slug} className="px-5 py-4 text-center text-[14px] text-on-surface">{p.brand}</td>
                ))}
              </tr>
              {/* Category */}
              <tr className="border-b border-outline-variant/10">
                <td className="px-5 py-4 text-[13px] text-on-surface-variant font-medium">Category</td>
                {products.map((p, i) => p && (
                  <td key={p.slug} className="px-5 py-4 text-center">
                    <span className="text-[12px] text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full capitalize">{p.category}</span>
                  </td>
                ))}
              </tr>
              {/* Prices per platform */}
              {Array.from(allPlatforms).map(platform => (
                <tr key={platform} className="border-b border-outline-variant/10">
                  <td className="px-5 py-4 text-[13px] text-on-surface-variant font-medium">
                    <span style={{ color: platformConfig[platform].color }}>{platformConfig[platform].label}</span>
                  </td>
                  {products.map((p, i) => {
                    const priceData = p?.prices[platform]
                    return (
                      <td key={p?.slug} className="px-5 py-4 text-center">
                        {priceData ? (
                          <div>
                            <span className="text-[15px] font-bold text-on-surface">{formatPrice(priceData.price)}</span>
                            {priceData.original > priceData.price && (
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-[11px] text-on-surface-variant line-through">{formatPrice(priceData.original)}</span>
                                <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">
                                  -{Math.round(((priceData.original - priceData.price) / priceData.original) * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[12px] text-on-surface-variant">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {/* Description */}
              <tr className="border-b border-outline-variant/10">
                <td className="px-5 py-4 text-[13px] text-on-surface-variant font-medium">Description</td>
                {products.map((p, i) => p && (
                  <td key={p.slug} className="px-5 py-4 text-center text-[12px] text-on-surface-variant">{p.description}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
