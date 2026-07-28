import { supabase } from '../../../../../lib/supabase/client';
import { normalizeClientError } from '../../../../../lib/utils/client-errors';
import type { ShareLinkItem, GenerateShareLinkInput, UpdateShareLinkSettingsInput } from '../../types/share-link';
import { resolveExpirationDate } from '../../utils/share-link';

/**
 * Fetch all share links for a project (or all projects).
 * Uses `.select('*')` to prevent PostgREST 400 errors from missing columns.
 */
export async function fetchProjectShareLinks(projectId?: string | null): Promise<ShareLinkItem[]> {
  try {
    let query = (supabase as any)
      .from('share_links')
      .select('*');

    if (projectId && projectId !== 'all') {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.warn('Share links fetch failed:', error.message);
      return [];
    }

    if (!data || !Array.isArray(data)) return [];

    return data.map((row: any) => ({
      id: row.id,
      projectId: row.project_id,
      token: row.token_hash || row.token || row.id,
      tokenHash: row.token_hash || undefined,
      passwordHash: row.password_hash || null,
      hasPassword: Boolean(row.password_hash),
      expiresAt: row.expires_at || null,
      isActive: row.is_active ?? true,
      maxViews: row.max_views || null,
      currentViews: Number(row.current_views ?? row.view_count ?? 0),
      revokedAt: row.revoked_at || null,
      lastAccessedAt: row.last_accessed_at || null,
      notes: row.notes || null,
      createdBy: row.created_by || null,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    }));
  } catch (err: unknown) {
    const normalized = normalizeClientError(err);
    console.warn('Failed to fetch share links:', normalized.message);
    return [];
  }
}

/**
 * Generate a new secure share link via direct DB insertion.
 * Does NOT call Edge Functions (avoids CORS errors when not deployed).
 * Only inserts columns that exist in the enterprise schema (0024).
 */
export async function generateProjectShareLink(input: GenerateShareLinkInput): Promise<ShareLinkItem> {
  const expiresAt = resolveExpirationDate(input.expirationPreset, input.customExpirationDate);

  // Generate 256-bit cryptographically secure random token
  const rawToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Hash password with SHA-256 if provided
  let passwordHash: string | null = null;
  if (input.hasPassword && input.password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`velis_share_salt_v1:${input.password}`);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    passwordHash = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Enterprise schema insert (token_hash, current_views — NO 'token' or 'view_count' columns)
  const { data, error } = await (supabase as any)
    .from('share_links')
    .insert([{
      project_id: input.projectId,
      token_hash: rawToken,
      password_hash: passwordHash,
      expires_at: expiresAt,
      is_active: true,
      current_views: 0,
    }])
    .select('*')
    .single();

  if (!error && data) {
    return {
      id: data.id,
      projectId: data.project_id,
      token: data.token_hash || rawToken,
      tokenHash: data.token_hash,
      passwordHash: data.password_hash,
      hasPassword: Boolean(data.password_hash),
      expiresAt: data.expires_at || null,
      isActive: true,
      currentViews: 0,
      notes: input.notes || null,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  }

  // If enterprise schema insert failed, log and throw so the mutation handler can show an error
  const errMsg = error?.message || 'Failed to insert share link';
  console.error('Share link insert failed:', errMsg);
  throw new Error(errMsg);
}

/**
 * Disable an active share link.
 */
export async function disableProjectShareLink(linkId: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('share_links')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', linkId);

  if (error) {
    console.warn('Disable share link failed:', error.message);
  }
}

/**
 * Regenerate a share link token (invalidates old, issues new).
 */
export async function regenerateProjectShareLink(linkId: string): Promise<ShareLinkItem> {
  const newToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const { data, error } = await (supabase as any)
    .from('share_links')
    .update({
      token_hash: newToken,
      revoked_at: null,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', linkId)
    .select('*')
    .single();

  if (!error && data) {
    return {
      id: data.id,
      projectId: data.project_id,
      token: newToken,
      tokenHash: newToken,
      passwordHash: data.password_hash,
      hasPassword: Boolean(data.password_hash),
      expiresAt: data.expires_at,
      isActive: true,
      currentViews: Number(data.current_views ?? 0),
      createdAt: data.created_at,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: linkId,
    projectId: 'unknown',
    token: newToken,
    expiresAt: null,
    isActive: true,
    currentViews: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Delete a share link permanently.
 */
export async function deleteProjectShareLink(linkId: string): Promise<void> {
  await (supabase as any).from('share_links').delete().eq('id', linkId);
}

/**
 * Update share link settings.
 */
export async function updateProjectShareLinkSettings(
  input: UpdateShareLinkSettingsInput
): Promise<void> {
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (input.expirationPreset) {
    updates.expires_at = resolveExpirationDate(input.expirationPreset, input.customExpirationDate);
  }

  if (input.hasPassword !== undefined) {
    if (input.hasPassword && input.password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(`velis_share_salt_v1:${input.password}`);
      const hashBuf = await crypto.subtle.digest('SHA-256', data);
      updates.password_hash = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } else if (!input.hasPassword) {
      updates.password_hash = null;
    }
  }

  if (input.isActive !== undefined) {
    updates.is_active = input.isActive;
    if (!input.isActive) {
      updates.revoked_at = new Date().toISOString();
    }
  }

  await (supabase as any).from('share_links').update(updates).eq('id', input.linkId);
}
