'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, Search, Tag, Bell, CircleUser, ArrowLeftRight } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function BottomNav() {
  const pathname = usePathname()
  const user = useStore(s => s.user)
  const compareCount = useStore(s => s.compareList.length)

  const tabs = [
    { href: '/', label: 'Home', icon: House },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/compare', label: 'Compare', icon: ArrowLeftRight },
    { href: '/deals', label: 'Deals', icon: Tag },
    { href: user ? '/alerts' : '/login', label: user ? 'Alerts' : 'Profile', icon: user ? Bell : CircleUser },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 w-full pb-safe z-50 glass border-t border-outline-variant/30">
      <div className="flex justify-around items-center h-[56px] w-full px-2">
        {tabs.map(tab => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          const Icon = tab.icon
          const isCompareTab = tab.href === '/compare'

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors relative ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              {isCompareTab && compareCount > 0 && (
                <span className="absolute -top-0.5 right-2 w-4 h-4 bg-primary text-on-primary text-[9px] font-bold rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
              <span className="text-[10px] leading-[12px] tracking-[0.07px] mt-[2px] font-medium">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
