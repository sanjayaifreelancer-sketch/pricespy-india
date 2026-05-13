import { formatPrice } from '@/lib/utils'

export default function PriceBadge({ price, original }: { price: number; original?: number }) {
  const discount = original && original > price ? Math.round(((original - price) / original) * 100) : 0
  return (
    <div className="flex flex-col">
      <span className="text-[20px] font-bold text-on-surface">{formatPrice(price)}</span>
      {original && original > price && (
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-on-surface-variant line-through">{formatPrice(original)}</span>
          <span className="text-[11px] font-semibold text-green-600 dark:text-green-400">-{discount}%</span>
        </div>
      )}
    </div>
  )
}
