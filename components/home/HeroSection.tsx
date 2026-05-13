'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <section className="pt-6 md:pt-12 pb-4 md:pb-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-[40px] md:text-[64px] font-bold tracking-tight text-on-surface mb-3 leading-[1.08]">
          Find the <span className="text-primary">Cheapest</span> Price
        </h1>
        <p className="text-[17px] md:text-[21px] text-on-surface-variant max-w-xl mx-auto font-normal">
          Compare prices on Amazon, Flipkart, Meesho & more — instantly, for free.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]">search</span>
        </div>
        <input
          className="w-full pl-12 pr-14 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-[17px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none shadow-sm"
          placeholder="Search for products, brands, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-on-primary text-[18px]">arrow_forward</span>
          </div>
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {[
          { label: 'iPhone 15 Pro', href: '/search?q=iPhone%2015%20Pro' },
          { label: 'boAt Earbuds', href: '/search?q=boAt%20Earbuds' },
          { label: 'Samsung TV', href: '/search?q=Samsung%20TV' },
          { label: 'Nike Shoes', href: '/search?q=Nike%20Shoes' },
        ].map(tag => (
          <Link
            key={tag.label}
            href={tag.href}
            className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/30 text-[13px] text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors font-medium"
          >
            {tag.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
