import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function createServiceRoleClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase Service Role environment credentials');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function verifyProjectExists(supabase: any, projectId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .maybeSingle();

  if (error || !data) return false;
  return true;
}

export async function insertShareLinkRecord(
  supabase: any,
  payload: {
    projectId: string;
    tokenHash: string;
    token: string;
    passwordHash: string | null;
    expiresAt: string | null;
    maxViews: number | null;
    notes: string | null;
  }
) {
  const record = {
    project_id: payload.projectId,
    token_hash: payload.tokenHash,
    token: payload.token,
    password_hash: payload.passwordHash,
    expires_at: payload.expiresAt,
    max_views: payload.maxViews,
    is_active: true,
    current_views: 0,
    view_count: 0,
    notes: payload.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('share_links')
    .insert([record])
    .select()
    .single();

  if (error) {
    throw new Error(`Database error inserting share link: ${error.message}`);
  }

  return data;
}
