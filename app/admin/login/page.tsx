'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { IndianRupee, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError

      if (data.user) {
        const { data: adminCheck } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle()

        if (adminCheck) {
          router.push('/admin')
        } else {
          await supabase.auth.signOut()
          setError('You do not have admin access.')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-primary" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <IndianRupee size={18} className="text-on-primary" strokeWidth={2.5} />
            </div>
            <h1 className="text-[24px] font-bold text-on-surface">PriceSpy Admin</h1>
          </div>
          <p className="text-[14px] text-on-surface-variant">Sign in to manage your store</p>
        </div>

        {error && (
          <div className="text-[13px] text-center mb-4 p-3 rounded-xl bg-error-container/50 text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-[15px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-[15px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl text-[15px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
