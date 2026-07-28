import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types';

// ============================================================================
// 1. Environment Validation
// ============================================================================

/**
 * Validates and retrieves required Vite environment variables at application startup.
 * Fails fast with descriptive developer-friendly errors if credentials are missing.
 */
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!envUrl || typeof envUrl !== 'string' || envUrl.trim() === '') {
  throw new Error('Missing required environment variable:\n\nVITE_SUPABASE_URL');
}

if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
  throw new Error('Missing required environment variable:\n\nVITE_SUPABASE_ANON_KEY');
}

const supabaseUrl = envUrl;

// ============================================================================
// 2. Client Configuration & Resilient Fetch
// ============================================================================

// Queue & concurrency control to prevent HTTP/2 stream overload & connection resets
let activeFetches = 0;
const fetchQueue: (() => void)[] = [];
const MAX_CONCURRENT_FETCHES = 5;

async function acquireFetchSlot(): Promise<void> {
  if (activeFetches < MAX_CONCURRENT_FETCHES) {
    activeFetches++;
    return;
  }
  await new Promise<void>((resolve) => fetchQueue.push(resolve));
  activeFetches++;
}

function releaseFetchSlot(): void {
  activeFetches--;
  if (fetchQueue.length > 0) {
    const next = fetchQueue.shift();
    if (next) next();
  }
}

/**
 * Resilient fetch wrapper with concurrency limiting & automatic retry.
 * Prevents HTTP/2 multiplexing burst overloads and handles connection resets gracefully.
 */
export async function resilientFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  maxRetries = 3,
  initialDelayMs = 200
): Promise<Response> {
  await acquireFetchSlot();
  try {
    let attempt = 0;
    const targetUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;

    while (true) {
      try {
        const opts: RequestInit = init ? { ...init } : {};
        return await fetch(targetUrl, opts);
      } catch (err: any) {
        attempt++;
        if (attempt > maxRetries) {
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, initialDelayMs * attempt));
      }
    }
  } finally {
    releaseFetchSlot();
  }
}

/**
 * Enterprise production configuration for Velis Supabase Client.
 * Configures Auth (PKCE flow, auto-refresh, session persistence), Realtime, and Headers.
 */
const clientConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    fetch: resilientFetch,
  },
};

// ============================================================================
// 3. Singleton Initialization
// ============================================================================

/**
 * Singleton Supabase Client Instance for Velis.
 * Serves as the single source of truth across Auth, Database, Realtime, Storage, and Edge Functions.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  clientConfig
);

// ============================================================================
// 4. Exports
// ============================================================================

export default supabase;
