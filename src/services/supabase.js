import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clean URL in case /rest/v1 or trailing slash was appended
const cleanUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const cleanAnonKey = rawAnonKey.trim();

export const isSupabaseConfigured = Boolean(
  cleanUrl && 
  cleanAnonKey && 
  cleanUrl.startsWith('http') && 
  !cleanUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, cleanAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
