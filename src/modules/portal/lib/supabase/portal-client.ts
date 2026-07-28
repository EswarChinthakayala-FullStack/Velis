import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { resilientFetch } from '../../../../lib/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Factory function creating a Supabase client for the portal.
 * 
 * Uses the anon key without a custom Authorization header.
 * Portal data access is secured via RLS policies that allow public SELECT
 * only on projects with active share links (see 0025_fix_share_links_schema.sql).
 */
export function createPortalSupabaseClient(_viewerJwt?: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: resilientFetch,
    },
  });
}
