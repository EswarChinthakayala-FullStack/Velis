import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function createServiceRoleClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase Service Role environment credentials');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function findShareLinkByToken(supabase: any, tokenHash: string, rawToken: string) {
  // Query only explicit required columns (never SELECT *)
  const { data, error } = await supabase
    .from('share_links')
    .select('id, project_id, token_hash, token, password_hash, expires_at, is_active, max_views, current_views, view_count, revoked_at')
    .or(`token_hash.eq.${tokenHash},token.eq.${rawToken}`)
    .maybeSingle();

  if (error) {
    throw new Error(`Database lookup error: ${error.message}`);
  }

  return data;
}

export async function verifyProjectActive(supabase: any, projectId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .maybeSingle();

  if (error || !data) return false;
  return true;
}
