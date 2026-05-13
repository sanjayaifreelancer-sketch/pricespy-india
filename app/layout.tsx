import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeInit } from '@/components/ThemeInit'

export const metadata: Metadata = {
  title: 'PriceSpy India - Compare Prices Across Every Store',
  description: 'Compare prices on Amazon, Flipkart, Meesho, Myntra & Croma — instantly. Find the cheapest price across every Indian store.',
  keywords: 'price comparison, India, Amazon, Flipkart, Meesho, cheapest prices, shopping deals',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PriceSpy India',
  },
  openGraph: {
    title: 'PriceSpy India',
    description: 'Compare prices across India\'s top stores. Save more, shop smarter.',
    type: 'website',
    locale: 'en_IN',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f9f9' },
    { media: '(prefers-color-scheme: dark)', color: '#141414' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background font-sans antialiased selection:bg-primary/20 selection:text-on-background pb-safe">
        <ThemeInit />
        {children}
      </body>
    </html>
  )
}
