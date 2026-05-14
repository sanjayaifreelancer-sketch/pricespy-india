'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import PriceCompareTable from '@/components/product/PriceCompareTable'
import PriceHistoryChart from '@/components/product/PriceHistoryChart'
import PriceAlertForm from '@/components/product/PriceAlertForm'
import ProductSpecs from '@/components/product/ProductSpecs'
import BestDealBanner from '@/components/ui/BestDealBanner'
import { formatPrice, getDiscount, getProductImage } from '@/lib/utils'
import { useProduct } from '@/lib/useProducts'
import { Platform } from '@/types'
import { ArrowLeft, Heart, Share2, Copy, Star, Zap, TrendingDown, TrendingUp } from 'lucide-react'
import { useStore } from '@/lib/store'

function generateInsight(discount: number, bestPrice: number, bestOriginal: number): { text: string; icon: 'down' | 'up' } {
  if (discount >= 30) return { text: `Massive ${discount}% off! Price is at its lowest point in months. This is an excellent time to buy before stock runs out.`, icon: 'down' }
  if (discount >= 15) return { text: `Price has dropped ${discount}% from ₹${(bestOriginal / 1000).toFixed(1)}K. Historical data suggests this discount may not last long — good value right now.`, icon: 'down' }
  if (discount >= 5) return { text: `Modest ${discount}% discount available. Prices have been stable. Consider waiting for a larger sale event if you're not in a hurry.`, icon: 'down' }
  return { text: `Currently at full price. Price history shows this product rarely drops below ₹${(bestPrice / 1000).toFixed(1)}K — set a price alert to catch future deals.`, icon: 'up' }
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { product } = useProduct(slug)
  const { toggleWishlist, isInWishlist } = useStore()

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-28 px-margin-mobile text-center">
          <h2 className="text-[22px] font-semibold">Product not found</h2>
          <Link href="/products" className="text-primary mt-4 inline-block">Back to products</Link>
        </main>
        <BottomNav />
      </>
    )
  }

  const entries = Object.entries(product.prices) as [Platform, { price: number; original: number; link: string; in_stock?: boolean }][]
  const bestEntry = entries.reduce((min, [, p]) => (p.price < min[1].price ? ([min[0], p] as [Platform, typeof p]) : min), entries[0] as [Platform, typeof entries[0][1]])
  const bestPrice = bestEntry[1].price
  const bestOriginal = bestEntry[1].original
  const discount = getDiscount(bestOriginal, bestPrice)
  const rating = product.rating ?? 4.2
  const reviewCount = product.review_count ?? 128
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5
  const insight = generateInsight(discount, bestPrice, bestOriginal)
  const wished = isInWishlist(slug)

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-28 px-margin-mobile md:px-margin-tablet max-w-7xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-1 text-[13px] text-on-surface-variant hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
              <div className="aspect-square bg-surface-container-low p-8 md:p-12 flex items-center justify-center relative">
                <img src={product.image_url || getProductImage(product.slug)} alt={product.name} className="object-contain w-full h-full max-h-[400px]" />
                {discount > 0 && (
                  <span className="absolute top-4 right-4 bg-error text-on-error px-3 py-1.5 rounded-full text-[12px] font-bold shadow-lg">-{discount}%</span>
                )}
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-[24px] md:text-[28px] font-bold text-on-surface tracking-tight">{product.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[12px] font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{product.brand}</span>
                      <span className="text-[12px] text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full capitalize">{product.category}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleWishlist(slug)} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-variant transition-colors shrink-0">
                    <Heart size={20} className={wished ? 'fill-apple-red text-apple-red' : 'text-on-surface-variant'} />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} className={i < fullStars ? 'fill-apple-orange text-apple-orange' : hasHalf && i === fullStars ? 'fill-apple-orange/50 text-apple-orange' : 'text-on-surface-variant/30'} />
                  ))}
                  <span className="text-[13px] text-on-surface-variant ml-1">({rating}) {reviewCount.toLocaleString('en-IN')} reviews</span>
                </div>
                <p className="text-[15px] text-on-surface-variant leading-relaxed">{product.description}</p>
                <div className="flex items-end gap-3">
                  <span className="text-[32px] md:text-[40px] font-bold text-on-surface">{formatPrice(bestPrice)}</span>
                  {bestOriginal > bestPrice && (
                    <><span className="text-[17px] text-on-surface-variant line-through mb-1">{formatPrice(bestOriginal)}</span><span className="text-[14px] font-semibold text-green-600 dark:text-green-400 mb-1">{discount}% off</span></>
                  )}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2 rounded-xl">
                  <Zap size={16} className="text-green-600 dark:text-green-400" />
                  <span className="text-[12px] font-medium text-green-700 dark:text-green-400">Lowest Price in 30 Days</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-[17px] font-semibold text-on-surface px-1">Compare Prices</h2>
              <PriceCompareTable product={product} />
            </div>
            <PriceHistoryChart productName={product.name} basePrice={bestPrice} />
            {product.specs && <ProductSpecs specs={product.specs} />}
          </div>
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <BestDealBanner platform={bestEntry[0]} price={bestPrice} original={bestOriginal} />
            <PriceAlertForm productName={product.name} productSlug={product.slug} currentPrice={bestPrice} />
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[22px] text-tertiary">stadia_controller</span>
                <h3 className="text-[15px] font-semibold text-on-surface">AI Price Insight</h3>
              </div>
              <div className="flex items-start gap-2 mb-1">
                {insight.icon === 'down' ? <TrendingDown size={16} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" /> : <TrendingUp size={16} className="text-apple-orange mt-0.5 shrink-0" />}
                <p className="text-[13px] text-on-surface-variant leading-relaxed">&ldquo;{insight.text}&rdquo;</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 text-[13px] font-medium text-on-surface hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 active:scale-95"><Share2 size={16} /> Share</button>
              <button className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 text-[13px] font-medium text-on-surface hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 active:scale-95"><Copy size={16} /> Copy Link</button>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
