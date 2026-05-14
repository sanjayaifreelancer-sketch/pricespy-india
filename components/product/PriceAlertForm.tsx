'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { createPriceAlert } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { Bell, CheckCircle } from 'lucide-react'

export default function PriceAlertForm({ productName, productSlug, currentPrice }: { productName: string; productSlug: string; currentPrice: number }) {
  const [email, setEmail] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const addAlert = useStore(s => s.addAlert)
  const user = useStore(s => s.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    addAlert({
      productName,
      productSlug,
      targetPrice: Number(targetPrice),
      currentPrice,
      email,
    })

    // Also persist to Supabase if configured
    try {
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('slug', productSlug)
        .maybeSingle()
      if (product) {
        await createPriceAlert({
          email,
          product_id: product.id,
          target_price: Number(targetPrice),
          user_id: user?.id,
        })
      }
    } catch {
      // Supabase not configured — local storage fallback is sufficient
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
        <div className="flex items-center gap-3">
          <CheckCircle size={28} className="text-green-500 shrink-0" />
          <div>
            <p className="text-[15px] font-semibold text-on-surface">Alert Set!</p>
            <p className="text-[12px] text-on-surface-variant">We&apos;ll email you when {productName} drops to {formatPrice(Number(targetPrice))}.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={20} className="text-primary" />
        <h3 className="text-[17px] font-semibold text-on-surface">Price Drop Alert</h3>
      </div>
      <p className="text-[12px] text-on-surface-variant mb-4">Current best price: <span className="font-semibold text-on-surface">{formatPrice(currentPrice)}</span></p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="number"
          value={targetPrice}
          onChange={e => setTargetPrice(e.target.value)}
          placeholder="Your target price (₹)"
          min="1"
          className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-[15px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          required
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-[15px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-on-primary py-3 rounded-xl text-[15px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
        >
          Set Alert — It&apos;s Free
        </button>
      </form>
    </div>
  )
}
