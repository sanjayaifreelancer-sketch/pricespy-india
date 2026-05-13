'use client'

import { generatePriceHistory, formatPrice } from '@/lib/utils'

export default function PriceHistoryChart({ productName, basePrice }: { productName: string; basePrice: number }) {
  const history = generatePriceHistory(basePrice)
  const maxPrice = Math.max(...history.map(h => h.price))
  const minPrice = Math.min(...history.map(h => h.price))
  const avgPrice = Math.round(history.reduce((s, h) => s + h.price, 0) / history.length)
  const points = history.map((h, i) => ({ x: i, y: h.price }))
  const width = 100
  const height = 100
  const padding = 10
  const chartW = width - padding * 2
  const chartH = height - padding * 2

  const xScale = (i: number) => padding + (i / (points.length - 1)) * chartW
  const yScale = (y: number) => padding + chartH - ((y - minPrice) / (maxPrice - minPrice || 1)) * chartH

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(p.y).toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${xScale(points.length - 1)},${yScale(minPrice)} L${xScale(0)},${yScale(minPrice)} Z`

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[17px] font-semibold text-on-surface">Price History</h3>
        <span className="text-[12px] text-on-surface-variant">Avg: {formatPrice(avgPrice)}</span>
      </div>
      <div className="h-40 w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#chart-grad)" />
          <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={xScale(points.length - 1)} cy={yScale(points[points.length - 1].y)} r="3" fill="var(--color-primary)" stroke="var(--color-surface-container-lowest)" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex justify-between mt-2">
        {history.filter((_, i) => i % 30 === 0 || i === history.length - 1).map(h => (
          <span key={h.date} className="text-[10px] text-outline">{h.date.slice(5)}</span>
        ))}
      </div>
      <div className="flex gap-6 mt-4 pt-3 border-t border-outline-variant/20">
        <div>
          <span className="text-[11px] text-on-surface-variant">Lowest</span>
          <p className="text-[14px] font-semibold text-green-600 dark:text-green-400">{formatPrice(minPrice)}</p>
        </div>
        <div>
          <span className="text-[11px] text-on-surface-variant">Highest</span>
          <p className="text-[14px] font-semibold text-error">{formatPrice(maxPrice)}</p>
        </div>
        <div>
          <span className="text-[11px] text-on-surface-variant">Current</span>
          <p className="text-[14px] font-semibold text-on-surface">{formatPrice(basePrice)}</p>
        </div>
      </div>
    </div>
  )
}
