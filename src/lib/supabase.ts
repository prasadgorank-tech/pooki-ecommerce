import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Safely initialize the client or return null during build
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== '') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); 

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.');
  }
}
