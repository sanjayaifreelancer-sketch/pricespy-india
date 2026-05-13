import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center px-margin-mobile h-14 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 text-[14px] text-primary font-medium hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </header>
      <div className="max-w-3xl mx-auto px-margin-mobile py-12">
        <h1 className="text-[32px] font-bold text-on-surface mb-6">Privacy Policy</h1>
        <div className="prose-custom space-y-5 text-[15px] text-on-surface-variant leading-relaxed">
          <p>Last updated: May 2026</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Information We Collect</h2>
          <p>PriceSpy India collects minimal information to provide price comparison services. We may collect your email address when you set up price alerts and basic usage analytics to improve our service.</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">How We Use Your Information</h2>
          <p>Your email is used solely to send price drop alerts you have requested. We do not share, sell, or rent your personal information to third parties.</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Affiliate Links</h2>
          <p>PriceSpy India participates in affiliate programs including Amazon Associates, Flipkart Affiliate, and others. When you click on product links and make a purchase, we may earn a small commission at no extra cost to you.</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Cookies</h2>
          <p>We use essential cookies for site functionality and prefer cookies to remember your preferences (theme, compare list).</p>
          <h2 className="text-[20px] font-semibold text-on-surface mt-8">Contact</h2>
          <p>If you have questions about this policy, please reach out to support@pricespy.in.</p>
        </div>
      </div>
    </main>
  )
}
