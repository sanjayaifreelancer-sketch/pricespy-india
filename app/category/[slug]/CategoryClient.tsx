'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import ProductCard from '@/components/product/ProductCard'
import { getAllProducts } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

const categoryNames: Record<string, string> = {
  mobiles: 'Mobiles',
  laptops: 'Laptops',
  earbuds: 'Earbuds',
  fashion: 'Fashion',
  'home-kitchen': 'Home & Kitchen',
  beauty: 'Beauty',
  cameras: 'Cameras',
  accessories: 'Accessories',
}

const categoryIcons: Record<string, string> = {
  mobiles: 'smartphone',
  laptops: 'laptop_mac',
  earbuds: 'headphones',
  fashion: 'checkroom',
  'home-kitchen': 'kitchen',
  beauty: 'spa',
  cameras: 'camera_alt',
  accessories: 'watch',
}

export default function CategoryClient({ slug }: { slug: string }) {
  const categoryName = categoryNames[slug] || slug.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())
  const allProducts = getAllProducts()
  const products = useMemo(() => allProducts.filter(p => p.category === slug), [allProducts, slug])

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-28 px-margin-mobile md:px-margin-tablet max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-[13px] text-on-surface-variant hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} />
          Home
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {categoryIcons[slug] || 'category'}
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-on-surface tracking-tight">{categoryName}</h1>
        </div>
        <p className="text-[15px] text-on-surface-variant mb-8">{products.length} product{products.length !== 1 ? 's' : ''} found.</p>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant">search_off</span>
            </div>
            <h3 className="text-[17px] font-semibold text-on-surface mb-1">No products yet</h3>
            <p className="text-[13px] text-on-surface-variant">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  )
}
