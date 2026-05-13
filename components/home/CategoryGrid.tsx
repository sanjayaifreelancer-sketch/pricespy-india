'use client'

import Link from 'next/link'

const categories = [
  { name: 'Mobiles', slug: 'mobiles', icon: 'smartphone', count: 28 },
  { name: 'Laptops', slug: 'laptops', icon: 'laptop_mac', count: 18 },
  { name: 'Earbuds', slug: 'earbuds', icon: 'headphones', count: 15 },
  { name: 'Fashion', slug: 'fashion', icon: 'checkroom', count: 22 },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'kitchen', count: 14 },
  { name: 'Beauty', slug: 'beauty', icon: 'spa', count: 12 },
  { name: 'Cameras', slug: 'cameras', icon: 'camera_alt', count: 9 },
  { name: 'Accessories', slug: 'accessories', icon: 'watch', count: 20 },
  { name: 'Grocery & Food', slug: 'grocery', icon: 'restaurant', count: 10 },
  { name: 'Health & Pharma', slug: 'health', icon: 'local_pharmacy', count: 15 },
  { name: 'Furniture & Home', slug: 'furniture', icon: 'chair', count: 12 },
  { name: 'Travel', slug: 'travel', icon: 'flight', count: 8 },
  { name: 'Eyewear', slug: 'eyewear', icon: 'glasses', count: 6 },
  { name: 'Automobile', slug: 'automobile', icon: 'directions_car', count: 7 },
  { name: 'Real Estate', slug: 'real-estate', icon: 'real_estate_agent', count: 5 },
  { name: 'Fintech', slug: 'fintech', icon: 'account_balance', count: 9 },
  { name: 'Baby & Kids', slug: 'baby-kids', icon: 'child_care', count: 8 },
  { name: 'Events & Tickets', slug: 'events', icon: 'confirmation_number', count: 4 },
  { name: 'Agriculture', slug: 'agriculture', icon: 'agriculture', count: 3 },
  { name: 'B2B & Industrial', slug: 'b2b', icon: 'precision_manufacturing', count: 6 },
]

export default function CategoryGrid() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-on-surface tracking-tight">Shop by Category</h2>
        <Link href="/products" className="text-[14px] font-medium text-primary hover:opacity-70 transition-opacity">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-surface-container-low flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all group-hover:scale-105">
              <span className="material-symbols-outlined text-primary text-[26px] md:text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
            </div>
            <span className="text-[11px] md:text-[12px] text-on-surface-variant group-hover:text-primary transition-colors text-center font-medium leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
