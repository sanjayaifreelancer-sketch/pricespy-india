'use client'

import { useEffect } from 'react'

export function ThemeInit() {
  useEffect(() => {
    const stored = localStorage.getItem('pricespy-store')
    if (stored) {
      try {
        const state = JSON.parse(stored)
        if (state?.state?.theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch {
        document.documentElement.classList.remove('dark')
      }
    }

    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      window.location.href = '/login' + hash
    }
  }, [])

  return null
}
