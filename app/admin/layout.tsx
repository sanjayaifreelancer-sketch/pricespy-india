'use client'

import { Component } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminGuard from '@/components/admin/AdminGuard'

class AdminErrorBoundary extends Component<{ children: React.ReactNode }, { error: string | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(err: any) {
    return { error: err?.message || String(err) }
  }
  componentDidCatch(err: any, info: any) {
    console.error('AdminLayout error:', err, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-8">
          <div className="max-w-xl text-center">
            <h1 className="text-[24px] font-bold text-on-surface mb-4">Something went wrong</h1>
            <pre className="text-[13px] text-error bg-error-container/10 p-4 rounded-xl mb-4 text-left overflow-auto max-h-60">{this.state.error}</pre>
            <button onClick={() => window.location.href = '/admin/login'} className="text-primary underline">Back to login</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) return <>{children}</>

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-surface">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminErrorBoundary>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminErrorBoundary>
  )
}
