'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Bell, BellOff, Trash2, ArrowLeft, Package } from 'lucide-react'

export default function AlertsPage() {
  const router = useRouter()
  const user = useStore(s => s.user)
  const alerts = useStore(s => s.alerts)
  const removeAlert = useStore(s => s.removeAlert)

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user, router])

  if (!user) return null

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-28 px-margin-mobile md:px-margin-tablet max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={24} className="text-primary" />
          <h1 className="text-[28px] font-bold text-on-surface tracking-tight">My Alerts</h1>
        </div>
        <p className="text-[15px] text-on-surface-variant mb-8">Manage your price drop alerts.</p>

        {alerts.length === 0 && (
          <div className="text-center py-20">
            <BellOff size={48} className="text-on-surface-variant/40 mx-auto mb-4" />
            <h2 className="text-[20px] font-semibold text-on-surface mb-2">No alerts yet</h2>
            <p className="text-[14px] text-on-surface-variant mb-6">Set a price alert on any product to get notified when it drops.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl text-[15px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95">
              <Package size={18} />
              Browse Products
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Bell size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${alert.productSlug}`} className="text-[15px] font-semibold text-on-surface hover:text-primary transition-colors truncate block">
                  {alert.productName}
                </Link>
                <p className="text-[12px] text-on-surface-variant mt-0.5">
                  Target: <span className="font-medium text-on-surface">{formatPrice(alert.targetPrice)}</span>
                  {' '}&middot;{' '}Current: {formatPrice(alert.currentPrice)}
                  {' '}&middot;{' '}{alert.email}
                </p>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-error-container/50 hover:text-error transition-all shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
