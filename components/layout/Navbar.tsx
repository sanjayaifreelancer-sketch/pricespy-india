'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Search, Bell, Menu, X, Moon, Sun, IndianRupee } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme, searchQuery, setSearchQuery, setSearchOpen } = useStore()
  const compareCount = useStore(s => s.compareList.length)
  const user = useStore(s => s.user)

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-outline-variant/30">
      <div className="flex justify-between items-center px-margin-mobile h-[52px] w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden text-on-surface-variant hover:text-on-surface transition-colors p-2 -ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <IndianRupee size={18} className="text-on-primary" strokeWidth={2.5} />
            </div>
            <h1 className="text-[20px] font-semibold tracking-[-0.35px] text-on-surface hidden sm:block">
              PriceSpy
            </h1>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-on-surface-variant" />
            </div>
            <input
              className="w-full pl-10 pr-4 py-[9px] bg-surface-container-low border border-outline-variant/30 rounded-xl text-[15px] text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) { router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false) } }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link href="/deals" className="text-on-surface-variant hover:text-primary transition-colors px-3 py-2 text-[14px] font-medium hidden sm:block">
            Deals
          </Link>
          <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors px-3 py-2 text-[14px] font-medium hidden sm:block">
            Products
          </Link>

          {/* Compare Badge */}
          <Link href="/compare" className="relative text-on-surface-variant hover:text-primary transition-colors p-2">
            <span className="material-symbols-outlined text-[22px]">compare_arrows</span>
            {compareCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="text-on-surface-variant hover:text-on-surface transition-colors p-2 md:hidden">
            <Search size={22} />
          </button>

          <Link href={user ? '/alerts' : '/login'} className="text-on-surface-variant hover:text-primary transition-colors p-2">
            <Bell size={22} />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-outline-variant/30">
          <div className="px-margin-mobile py-4 flex flex-col gap-2">
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-on-surface-variant" />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-[15px] text-on-surface placeholder-on-surface-variant outline-none"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) { router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setMenuOpen(false) } }}
              />
            </div>
            {['Deals', 'Products', 'Compare', 'Mobiles', 'Laptops', 'Earbuds', 'Fashion'].map(item => (
              <Link
                key={item}
                href={item === 'Deals' ? '/deals' : item === 'Compare' ? '/compare' : item === 'Products' ? '/products' : `/category/${item.toLowerCase()}`}
                className="text-[15px] text-on-surface-variant hover:text-primary py-2 px-2 rounded-lg hover:bg-surface-container-low transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="border-t border-outline-variant/30 mt-2 pt-3">
              <button
                onClick={() => { toggleTheme(); setMenuOpen(false) }}
                className="flex items-center gap-3 text-[15px] text-on-surface-variant hover:text-primary py-2 px-2 rounded-lg hover:bg-surface-container-low transition-colors w-full"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
