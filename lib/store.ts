'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name?: string
}

interface CompareItem {
  productId: string
  name: string
  slug: string
  image_url?: string
}

interface SavedAlert {
  id: string
  productName: string
  productSlug: string
  targetPrice: number
  currentPrice: number
  email: string
  createdAt: string
}

interface AppState {
  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void

  // Auth
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean

  // Compare
  compareList: CompareItem[]
  addToCompare: (item: CompareItem) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void

  // Wishlist (local fallback for non-logged-in users)
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean

  // Alerts
  alerts: SavedAlert[]
  addAlert: (alert: Omit<SavedAlert, 'id' | 'createdAt'>) => void
  removeAlert: (id: string) => void

  // UI
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', next === 'dark')
        set({ theme: next })
      },

      // Auth
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,

      // Compare
      compareList: [],
      addToCompare: (item) => {
        const list = get().compareList
        if (list.length < 4 && !list.find(i => i.productId === item.productId)) {
          set({ compareList: [...list, item] })
        }
      },
      removeFromCompare: (productId) =>
        set({ compareList: get().compareList.filter(i => i.productId !== productId) }),
      clearCompare: () => set({ compareList: [] }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const list = get().wishlist
        set({
          wishlist: list.includes(productId)
            ? list.filter(id => id !== productId)
            : [...list, productId],
        })
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // Alerts
      alerts: [],
      addAlert: (alert) => {
        const newAlert: SavedAlert = {
          ...alert,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set({ alerts: [...get().alerts, newAlert] })
      },
      removeAlert: (id) => set({ alerts: get().alerts.filter(a => a.id !== id) }),

      // UI
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: 'pricespy-store',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        wishlist: state.wishlist,
        compareList: state.compareList,
        alerts: state.alerts,
      }),
    }
  )
)
