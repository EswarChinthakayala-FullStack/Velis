import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase/client';
import type { PortalAuthState, ValidateTokenResult } from '../lib/types/portal';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates a share token directly against the database.
 * Does NOT call Edge Functions (they may not be deployed).
 */
export function useValidateShareToken(rawToken: string) {
  const [state, setState] = useState<PortalAuthState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validate = useCallback(async (password?: string): Promise<ValidateTokenResult> => {
    if (!rawToken || !rawToken.trim()) {
      setState('invalid');
      setErrorMsg('Invalid token');
      return { success: false, status: 'invalid', error: 'Invalid token' };
    }

    setState('validating');
    setErrorMsg(null);

    try {
      let link: any = null;
      const cleanToken = rawToken.trim();

      // 1. Try token_hash column first
      const { data: d1 } = await (supabase as any)
        .from('share_links')
        .select('*')
        .eq('token_hash', cleanToken)
        .maybeSingle();

      if (d1) {
        link = d1;
      }

      // 2. Try token column second
      if (!link) {
        const { data: d2 } = await (supabase as any)
          .from('share_links')
          .select('*')
          .eq('token', cleanToken)
          .maybeSingle();

        if (d2) {
          link = d2;
        }
      }

      // 3. Try id column ONLY if cleanToken is a valid UUID format (prevents Postgres 400 Bad Request)
      if (!link && UUID_REGEX.test(cleanToken)) {
        const { data: d3 } = await (supabase as any)
          .from('share_links')
          .select('*')
          .eq('id', cleanToken)
          .maybeSingle();

        if (d3) {
          link = d3;
        }
      }

      if (!link) {
        setState('invalid');
        setErrorMsg('Share link not found or invalid');
        return { success: false, status: 'invalid', error: 'Share link not found' };
      }

      // Check active status
      if (!link.is_active || link.revoked_at) {
        setState('revoked');
        setErrorMsg('Access to this share link has been revoked');
        return { success: false, status: 'revoked', error: 'Access revoked' };
      }

      // Check expiration
      if (link.expires_at && new Date(link.expires_at) <= new Date()) {
        setState('expired');
        setErrorMsg('Share link has expired');
        return { success: false, status: 'expired', error: 'Share link expired' };
      }

      // Check view limit
      const currentViews = Number(link.current_views ?? link.view_count ?? 0);
      if (link.max_views !== null && link.max_views !== undefined && currentViews >= link.max_views) {
        setState('view_limit_exceeded');
        setErrorMsg('Maximum view limit reached');
        return { success: false, status: 'view_limit_exceeded', error: 'View limit reached' };
      }

      // Check password
      if (link.password_hash) {
        if (!password) {
          setState('password_required');
          setErrorMsg('Password is required');
          return { success: false, status: 'password_required', error: 'Password required' };
        }

        // Verify password against stored hash
        const encoder = new TextEncoder();

        // Check salted SHA-256 hash
        const saltedData = encoder.encode(`velis_share_salt_v1:${password}`);
        const saltedHashBuf = await crypto.subtle.digest('SHA-256', saltedData);
        const saltedHash = Array.from(new Uint8Array(saltedHashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');

        // Check raw SHA-256 hash
        const rawData = encoder.encode(password);
        const rawHashBuf = await crypto.subtle.digest('SHA-256', rawData);
        const rawHash = Array.from(new Uint8Array(rawHashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');

        // Check legacy prefix hash
        const prefixedHash = `hashed_${password}`;

        const isMatch =
          link.password_hash === saltedHash ||
          link.password_hash === rawHash ||
          link.password_hash === prefixedHash;

        if (!isMatch) {
          setState('invalid_password');
          setErrorMsg('Incorrect password');
          return { success: false, status: 'invalid_password', error: 'Incorrect password' };
        }
      }

      // Update view analytics (non-blocking, best-effort)
      (supabase as any)
        .from('share_links')
        .update({
          current_views: currentViews + 1,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', link.id)
        .then(() => {})
        .catch(() => {});

      setState('valid');
      return {
        success: true,
        status: 'valid',
        projectId: link.project_id,
        accessToken: 'session_active',
        expiresIn: 900,
      };
    } catch (err: any) {
      setState('error');
      setErrorMsg(err?.message || 'Token validation error');
      return { success: false, status: 'error', error: err?.message };
    }
  }, [rawToken]);

  return {
    state,
    errorMsg,
    validate,
  };
}
