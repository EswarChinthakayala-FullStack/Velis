import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types';

// ============================================================================
// 1. Environment Validation
// ============================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
  throw new Error('Missing required environment variable: VITE_SUPABASE_URL');
}

if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
  throw new Error('Missing required environment variable: VITE_SUPABASE_ANON_KEY');
}

// ============================================================================
// 2. Resilient Fetch Wrapper (Retries ERR_CONNECTION_RESET & ERR_HTTP2_PROTOCOL_ERROR)
// ============================================================================

const fetchWithRetry = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  retries = 3,
  delay = 500
): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(input, init);
      return response;
    } catch (err: any) {
      if (i === retries - 1) throw err;
      // Exponential backoff delay for network socket resets / HTTP2 protocol drops
      await new Promise((res) => setTimeout(res, delay * Math.pow(2, i)));
    }
  }
  return fetch(input, init);
};

// ============================================================================
// 3. Singleton Initialization (Standard Official Supabase Client)
// ============================================================================

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: fetchWithRetry,
    },
  }
);

export async function resilientFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetchWithRetry(input, init);
}

export default supabase;
