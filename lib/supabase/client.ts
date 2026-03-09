import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function isSupabaseConfigured(): boolean {
  return !!url && !!anonKey;
}

export const supabase = isSupabaseConfigured()
  ? createClient(url, anonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');
