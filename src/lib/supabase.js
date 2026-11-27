import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Supabase keys are missing. Copy .env.example to .env.local, fill it in, then restart npm run dev.')
}

// Only the public anon key belongs in the frontend. Never use the service_role key here.
export const supabase = createClient(url || 'http://localhost', key || 'missing-key')