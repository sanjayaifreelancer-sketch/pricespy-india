import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let _supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseKey) {
  _supabase = createClient(supabaseUrl, supabaseKey)
}

const stubHandler = () => Promise.reject(new Error('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'))

export const supabase: any = _supabase ?? new Proxy({}, {
  get() { return stubHandler }
})
