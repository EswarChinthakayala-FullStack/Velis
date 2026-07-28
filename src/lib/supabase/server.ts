import { createServerClient, parseCookieHeader, serializeCookieHeader, type CookieOptions } from '@supabase/ssr';
import type { Database } from '../../types/database.types';

// ============================================================================
// 1. Environment Validation
// ============================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
  throw new Error('Missing required environment variable for SSR:\n\nVITE_SUPABASE_URL');
}

if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
  throw new Error('Missing required environment variable for SSR:\n\nVITE_SUPABASE_ANON_KEY');
}

export interface CookieItem {
  name: string;
  value: string;
  options?: CookieOptions;
}

// ============================================================================
// 2. Server Client Factory
// ============================================================================

/**
 * Creates an SSR-compatible Supabase client instance bound to request cookies.
 * Enables secure session validation and data fetching on the server.
 */
export function createClient(request?: Request) {
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          if (!request) return [];
          const cookieHeader = request.headers.get('Cookie') ?? '';
          return parseCookieHeader(cookieHeader) as CookieItem[];
        },
        setAll(cookiesToSet: CookieItem[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append('Set-Cookie', serializeCookieHeader(name, value, options ?? {}));
          });
        },
      },
    }
  );

  return { supabase, headers };
}

export default createClient;
