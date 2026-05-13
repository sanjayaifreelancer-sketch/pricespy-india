import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface-container-high border-t border-outline-variant/30 px-margin-mobile md:px-margin-tablet py-10 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <span className="font-title-3 text-title-3 text-on-surface">PriceSpy India</span>
          </div>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">Compare prices across India&apos;s top stores. Save more, shop smarter with real-time price tracking.</p>
        </div>
        <div>
          <h4 className="font-headline text-headline text-on-surface mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link href="/deals" className="text-[13px] text-on-surface-variant hover:text-primary transition-colors">Best Deals</Link>
            <Link href="/products" className="text-[13px] text-on-surface-variant hover:text-primary transition-colors">All Products</Link>
            <Link href="/compare" className="text-[13px] text-on-surface-variant hover:text-primary transition-colors">Compare</Link>
          </div>
        </div>
        <div>
          <h4 className="font-headline text-headline text-on-surface mb-3">Categories</h4>
          <div className="flex flex-col gap-2">
            {['Mobiles', 'Laptops', 'Earbuds', 'Fashion', 'Home & Kitchen'].map(cat => (
              <Link key={cat} href={`/category/${cat.toLowerCase().replace(' & ', '-')}`} className="text-[13px] text-on-surface-variant hover:text-primary transition-colors">{cat}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-headline text-headline text-on-surface mb-3">Support</h4>
          <div className="flex flex-col gap-2">
            <Link href="/login" className="text-[13px] text-on-surface-variant hover:text-primary transition-colors">My Account</Link>
            <Link href="/privacy" className="text-[13px] text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[13px] text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 mt-8 pt-6 text-center">
        <p className="text-[11px] text-on-surface-variant">© 2026 PriceSpy India. All rights reserved. As an Amazon Associate, we earn from qualifying purchases.</p>
      </div>
    </footer>
  )
}
