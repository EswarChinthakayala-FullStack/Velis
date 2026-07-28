import { useState, useCallback, useMemo } from 'react';
import { createPortalSupabaseClient } from '../lib/supabase/portal-client';
import type { SupabaseClient } from '@supabase/supabase-js';

export function usePortalSession() {
  // MEMORY ONLY STORAGE: Never written to localStorage/sessionStorage/IndexedDB
  const [viewerJwt, setViewerJwt] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const viewerClient = useMemo<SupabaseClient | null>(() => {
    if (!viewerJwt) return null;
    return createPortalSupabaseClient(viewerJwt);
  }, [viewerJwt]);

  const updateSession = useCallback((token: string, targetProjectId: string) => {
    setViewerJwt(token);
    setProjectId(targetProjectId);
  }, []);

  const clearSession = useCallback(() => {
    setViewerJwt(null);
    setProjectId(null);
  }, []);

  return {
    viewerJwt,
    projectId,
    viewerClient,
    updateSession,
    clearSession,
  };
}
