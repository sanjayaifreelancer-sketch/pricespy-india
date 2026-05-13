'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/lib/store'
import { IndianRupee, Eye, EyeOff, LogIn, UserPlus, ArrowLeft, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setUser = useStore(s => s.setUser)

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      setMode('reset')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (error) throw error
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email!, name })
          setMode('login')
          setError('Account created! Please check your email to confirm.')
        }
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) throw error
        setError('Password updated! Redirecting to admin login...')
        setTimeout(() => router.push('/admin/login'), 2000)
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
          })
          router.push('/')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Please enter your email first'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://pricespy-india.vercel.app/login',
    })
    setLoading(false)
    if (error) setError(error.message)
    else setError('Check your email for the reset link.')
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      await supabase.auth.signInWithOAuth({ provider })
    } catch (err: any) {
      setError(err.message || 'Social login failed')
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center px-margin-mobile h-14 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <IndianRupee size={18} className="text-on-primary" strokeWidth={2.5} />
          </div>
          <h1 className="text-[18px] font-semibold tracking-tight text-on-surface">PriceSpy India</h1>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-margin-mobile py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {mode === 'login' ? (
                <LogIn size={28} className="text-primary" />
              ) : mode === 'reset' ? (
                <Lock size={28} className="text-primary" />
              ) : (
                <UserPlus size={28} className="text-primary" />
              )}
            </div>
            <h2 className="text-[28px] font-bold text-on-surface mb-1">
              {mode === 'login' ? 'Welcome back' : mode === 'reset' ? 'Reset password' : 'Create account'}
            </h2>
            <p className="text-[15px] text-on-surface-variant">
              {mode === 'login' ? 'Sign in to track your price alerts' : mode === 'reset' ? 'Enter your new password' : 'Start comparing prices instantly'}
            </p>
          </div>

          {/* Tab Toggle */}
          {mode !== 'reset' && <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-1 flex mb-6">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-[14px] font-medium text-center transition-all ${
                mode === 'login'
                  ? 'bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-[14px] font-medium text-center transition-all ${
                mode === 'signup'
                  ? 'bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign Up
            </button>
          </div>}

          {error && (
            <div className={`text-[13px] text-center mb-4 p-3 rounded-xl ${
              error.includes('created') ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-error-container/50 text-error'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-[15px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            )}
            {mode !== 'reset' ? (
              <div>
                <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-[15px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            ) : null}
            {mode === 'reset' ? (
              <div className="relative">
                <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 pr-12 text-[15px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3.5 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            ) : (
              <div className="relative">
                <label className="text-[12px] font-medium text-on-surface-variant mb-1.5 block">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 pr-12 text-[15px] text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3.5 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-[12px] text-primary hover:opacity-70 transition-opacity font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3.5 rounded-xl text-[15px] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              ) : mode === 'reset' ? (
                'Update Password'
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {mode !== 'reset' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-[12px] text-on-surface-variant">or continue with</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 text-[13px] font-medium text-on-surface hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">g_mobiledata</span>
                  Google
                </button>
                <button
                  onClick={() => handleSocialLogin('apple')}
                  className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 text-[13px] font-medium text-on-surface hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">apple</span>
                  Apple
                </button>
              </div>

              <p className="text-center mt-8 text-[13px] text-on-surface-variant">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
                  className="text-primary font-semibold hover:opacity-70 transition-opacity"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
