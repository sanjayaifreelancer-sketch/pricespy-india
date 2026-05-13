import Link from 'next/link'
import { IndianRupee } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-margin-mobile text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <IndianRupee size={36} className="text-primary" />
      </div>
      <h1 className="text-[64px] font-bold text-on-surface tracking-tight leading-none mb-2">404</h1>
      <h2 className="text-[22px] font-semibold text-on-surface mb-2">Page not found</h2>
      <p className="text-[15px] text-on-surface-variant mb-8 max-w-sm">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link
        href="/"
        className="bg-primary text-on-primary px-6 py-3 rounded-xl text-[15px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
      >
        Go Home
      </Link>
    </main>
  )
}
