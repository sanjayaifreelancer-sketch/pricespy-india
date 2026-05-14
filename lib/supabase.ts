import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let _supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseKey) {
  _supabase = createClient(supabaseUrl, supabaseKey)
}

// Chainable stub that mimics PostgrestQueryBuilder so chained calls (.delete().eq()) don't crash
function stubQueryBuilder(): any {
  return new Proxy({} as any, {
    get: (_target, prop) => {
      if (prop === 'then') {
        return (resolve: (v: PostgrestResponse<any>) => void) =>
          resolve({ data: null, error: { message: 'Supabase not configured', details: '', hint: '', code: '' } } as any)
      }
      return () => stubQueryBuilder()
    },
  })
}

const supabaseStub = new Proxy({} as SupabaseClient, {
  get: (_target, prop) => {
    if (prop === 'auth') {
      return {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        updateUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
        resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
      }
    }
    if (prop === 'rpc') {
      return () => Promise.resolve({ data: null, error: null })
    }
    return () => stubQueryBuilder()
  },
})

export const supabase = (_supabase ?? supabaseStub) as SupabaseClient
