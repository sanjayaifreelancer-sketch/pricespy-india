import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center px-margin-mobile h-14 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 text-[14px] text-primary font-medium hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </header>
      <div className="max-w-3xl mx-auto px-margin-mobile py-12">
        <h1 className="text-[32px] font-bold text-on-surface mb-6">Terms of Service</h1>
        <div className="prose-custom space-y-5 text-[15px] text-on-surface-variant leading-relaxed">
          <p>Last updated: May 2026</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Use of Service</h2>
          <p>PriceSpy India provides price comparison information for educational and shopping assistance purposes. Prices shown may not reflect the most current pricing on retailer websites.</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Accuracy</h2>
          <p>While we strive for accuracy, we cannot guarantee that all price information is error-free. Always verify prices on the retailer&apos;s website before making a purchase.</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Affiliate Disclosure</h2>
          <p>PriceSpy India uses affiliate links. We may earn commissions on purchases made through these links. This does not affect the price you pay.</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Limitation of Liability</h2>
          <p>PriceSpy India is not responsible for any discrepancies in pricing, product availability, or any issues arising from purchases made through third-party retailers.</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Changes</h2>
          <p>We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of any changes.</p>
        </div>
      </div>
    </main>
  )
}
