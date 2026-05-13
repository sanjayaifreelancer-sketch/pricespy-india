'use client'

import { Platform, platformConfig, SampleProduct } from '@/types'
import { formatPrice, getDiscount, getBestPrice, handleBuyClick } from '@/lib/utils'
import { ExternalLink, Zap } from 'lucide-react'

export default function PriceCompareTable({ product }: { product: SampleProduct }) {
  const entries = Object.entries(product.prices) as [Platform, { price: number; original: number; link: string; in_stock?: boolean }][]
  const bestPrice = getBestPrice(
    entries.map(([platform, p]) => ({
      id: '', product_id: '', platform,
      price: p.price, original_price: p.original,
      discount_percent: getDiscount(p.original, p.price),
      affiliate_link: p.link, in_stock: p.in_stock !== false, last_updated: ''
    }))
  )

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="text-left px-5 py-4 text-[13px] font-semibold text-on-surface-variant">Platform</th>
              <th className="text-right px-5 py-4 text-[13px] font-semibold text-on-surface-variant">Price</th>
              <th className="text-right px-5 py-4 text-[13px] font-semibold text-on-surface-variant hidden sm:table-cell">Discount</th>
              <th className="text-right px-5 py-4 text-[13px] font-semibold text-on-surface-variant">Buy</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([platform, priceData], idx) => {
              const isBest = bestPrice && priceData.price === bestPrice.price && priceData.in_stock !== false
              const discount = getDiscount(priceData.original, priceData.price)
              const cfg = platformConfig[platform]
              const outOfStock = priceData.in_stock === false

              return (
                <tr
                  key={platform}
                  className={`border-b border-outline-variant/10 last:border-b-0 transition-colors ${
                    isBest ? 'bg-primary/5' : ''
                  } ${outOfStock ? 'opacity-50' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[15px] font-bold shrink-0"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-semibold text-on-surface">{cfg.label}</span>
                        {isBest && (
                          <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                            <Zap size={12} />
                            BEST PRICE
                          </span>
                        )}
                        {outOfStock && (
                          <span className="text-[11px] text-error font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[18px] font-bold text-on-surface">{formatPrice(priceData.price)}</span>
                      {priceData.original > priceData.price && (
                        <span className="text-[12px] text-on-surface-variant line-through">{formatPrice(priceData.original)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right hidden sm:table-cell">
                    {discount > 0 && (
                      <span className="inline-flex items-center bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                        ↓ {discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {outOfStock ? (
                      <span className="text-[12px] text-on-surface-variant">Unavailable</span>
                    ) : (
                      <button
                        onClick={(e) => { e.preventDefault(); handleBuyClick(priceData.link, platform, product.slug) }}
                        className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 whitespace-nowrap"
                      >
                        Buy Now
                        <ExternalLink size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
