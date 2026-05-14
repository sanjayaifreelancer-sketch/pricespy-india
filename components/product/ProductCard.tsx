'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { SampleProduct, Platform, platformConfig } from '@/types'
import { formatPrice, getDiscount, getProductImage } from '@/lib/utils'
import { useStore } from '@/lib/store'

export default function ProductCard({ product }: { product: SampleProduct }) {
  const entries = Object.entries(product.prices) as [Platform, { price: number; original: number }][]
  const bestEntry = entries.reduce((min, [, p]) => (p.price < min[1].price ? ([min[0], p] as [Platform, typeof p]) : min), entries[0] as [Platform, typeof entries[0][1]])
  const bestPrice = bestEntry[1]
  const bestPlatform = product.brand
  const discount = getDiscount(bestPrice.original, bestPrice.price)

  const { toggleWishlist, isInWishlist } = useStore()
  const wished = isInWishlist(product.slug)

  return (
    <Link href={`/products/${product.slug}`}>
      <article className="group bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden flex flex-col hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer h-full active:scale-[0.98] duration-200">
        <div className="relative aspect-[4/3] bg-surface-container-low p-6 flex items-center justify-center overflow-hidden">
          <img
            src={product.image_url || getProductImage(product.slug) || `https://via.placeholder.com/300x300/e3e2e7/414755?text=${product.name[0]}`}
            alt={product.name}
            className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-error text-on-error px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.slug) }}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <Heart size={16} className={wished ? 'fill-apple-red text-apple-red' : 'text-on-surface-variant'} />
          </button>
        </div>
        <div className="p-4 flex flex-col flex-grow gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-on-surface leading-tight line-clamp-2">{product.name}</h3>
          </div>
          <span className="text-[11px] text-on-surface-variant font-medium">{product.brand}</span>
          <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-bold text-on-surface">{formatPrice(bestPrice.price)}</span>
              {bestPrice.original > bestPrice.price && (
                <span className="text-[12px] text-on-surface-variant line-through">{formatPrice(bestPrice.original)}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {(Object.entries(product.prices) as [Platform, { price: number }][]).slice(0, 3).map(([platform]) => (
                <span
                  key={platform}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: platformConfig[platform].bg, color: platformConfig[platform].color }}
                >
                  {platformConfig[platform].label}
                </span>
              ))}
              {(Object.entries(product.prices) as [Platform, { price: number }][]).length > 3 && (
                <span className="text-[10px] text-on-surface-variant font-medium">+more</span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
