'use client'

import { Platform, platformConfig } from '@/types'
import { formatPrice, getDiscount } from '@/lib/utils'
import { ShoppingBag, Check, Zap } from 'lucide-react'

export default function BestDealBanner({ platform, price, original }: { platform: Platform; price: number; original: number }) {
  const cfg = platformConfig[platform]
  const discount = getDiscount(original, price)
  const savings = original - price

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
      <div className="bg-primary px-5 py-3 flex items-center gap-2">
        <Zap size={18} className="text-on-primary" />
        <span className="text-[13px] font-bold text-on-primary tracking-wider">BEST DEAL</span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-[18px] font-bold shrink-0"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {cfg.label[0]}
          </div>
          <div>
            <span className="text-[15px] font-semibold text-on-surface">{cfg.label}</span>
            <p className="text-[24px] font-bold text-on-surface">{formatPrice(price)}</p>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3">
          <p className="text-[13px] font-medium text-green-700 dark:text-green-400">
            You save {formatPrice(savings)} · {discount}% off
          </p>
        </div>
        <button
          onClick={() => window.open('#', '_blank', 'noopener,noreferrer')}
          className="w-full bg-primary text-on-primary py-3.5 rounded-xl text-[14px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={18} />
          BUY ON {cfg.label.toUpperCase()}
        </button>
        <div className="flex flex-col gap-1.5">
          {['Free Delivery', 'Easy Returns', 'Cash on Delivery'].map(f => (
            <span key={f} className="text-[12px] text-on-surface-variant flex items-center gap-1.5">
              <Check size={14} className="text-green-500" />
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
