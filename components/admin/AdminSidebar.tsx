'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Package, Tags, LogOut, IndianRupee } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/30 h-screen flex flex-col shrink-0">
      <Link href="/admin" className="flex items-center gap-2.5 px-6 h-16 border-b border-outline-variant/30">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <IndianRupee size={18} className="text-on-primary" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-[15px] font-semibold text-on-surface leading-tight">PriceSpy</h1>
          <p className="text-[11px] text-on-surface-variant">Admin Panel</p>
        </div>
      </Link>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                active
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-outline-variant/30">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all mb-1"
        >
          <IndianRupee size={18} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium text-on-surface-variant hover:bg-error-container/50 hover:text-error transition-all w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
