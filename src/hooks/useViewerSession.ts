import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { portalService } from '../services/portal.service';
import { SupabaseClient } from '@supabase/supabase-js';

export interface UseViewerSessionOptions {
  rawShareToken: string;
  onSessionExpired?: () => void;
  onSessionRevoked?: () => void;
}

export function useViewerSession({
  rawShareToken,
  onSessionExpired,
  onSessionRevoked
}: UseViewerSessionOptions) {
  const [viewerJwt, setViewerJwt] = useState<string | null>(authService.getViewerToken());
  const [projectId, setProjectId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [viewerClient, setViewerClient] = useState<SupabaseClient | null>(null);

  const updateSession = useCallback((token: string, projId: string, exp: number) => {
    authService.setViewerToken(token);
    setViewerJwt(token);
    setProjectId(projId);
    setExpiresAt(exp);
    const client = portalService.createViewerClient(token);
    setViewerClient(client);
  }, []);

  const clearSession = useCallback(() => {
    authService.clearViewerToken();
    setViewerJwt(null);
    setProjectId(null);
    setExpiresAt(null);
    setViewerClient(null);
  }, []);

  // Silent auto-refresh 60 seconds before 15-min JWT expiry
  useEffect(() => {
    if (!expiresAt || !rawShareToken) return;

    const timeUntilRefreshMs = Math.max(0, expiresAt - Date.now() - 60000);
    const timer = setTimeout(async () => {
      try {
        const res = await portalService.refreshViewerToken(rawShareToken);
        if (res.status === 'valid' && res.token && res.project_id && res.expires_at) {
          updateSession(res.token, res.project_id, res.expires_at);
        } else if (res.status === 'revoked') {
          clearSession();
          onSessionRevoked?.();
        } else if (res.status === 'expired') {
          clearSession();
          onSessionExpired?.();
        }
      } catch (err) {
        clearSession();
        onSessionExpired?.();
      }
    }, timeUntilRefreshMs);

    return () => clearTimeout(timer);
  }, [expiresAt, rawShareToken, updateSession, clearSession, onSessionExpired, onSessionRevoked]);

  return {
    viewerJwt,
    projectId,
    expiresAt,
    viewerClient,
    updateSession,
    clearSession
  };
}
