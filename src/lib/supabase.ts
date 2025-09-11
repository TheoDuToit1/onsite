import { createClient } from '@supabase/supabase-js'

// Supabase project details
// URL and anon key are safe to use in the browser for public APIs.
const SUPABASE_URL = 'https://gycukndxnayuzximlzqv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Y3VrbmR4bmF5dXp4aW1senF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzE0MzQsImV4cCI6MjA3MTYwNzQzNH0.9WgZXDqx6Yp_i18DWT-czgCFSS9n9o_348spAoDCHEQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
