'use client'

import ProductCard from '@/components/product/ProductCard'
import { getAllProducts } from '@/lib/utils'

export default function TopProducts() {
  const products = getAllProducts()
  return (
    <section className="space-y-5">
      <h2 className="text-[22px] font-semibold text-on-surface tracking-tight">Top Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}
