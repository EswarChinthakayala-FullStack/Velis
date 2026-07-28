import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';
import { shareLinkKeys } from './useShareLinks';

export interface ShareLinkAnalyticsData {
  linkId: string;
  totalViews: number;
  lastAccessedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export function useShareLinkAnalytics(linkId?: string | null) {
  return useQuery<ShareLinkAnalyticsData | null>({
    queryKey: ['share-link-analytics', linkId],
    queryFn: async () => {
      if (!linkId) return null;

      const { data, error } = await (supabase as any)
        .from('share_links')
        .select('id, current_views, view_count, last_accessed_at, created_at, expires_at')
        .eq('id', linkId)
        .single();

      if (error || !data) return null;

      return {
        linkId: data.id,
        totalViews: Number(data.current_views || data.view_count || 0),
        lastAccessedAt: data.last_accessed_at || null,
        createdAt: data.created_at || new Date().toISOString(),
        expiresAt: data.expires_at || null,
      };
    },
    enabled: Boolean(linkId),
  });
}
