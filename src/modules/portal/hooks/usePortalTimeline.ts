import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchPortalTimeline } from '../lib/supabase/queries/portal';
import type { PortalTimelineEvent } from '../lib/types/portal';

export function usePortalTimeline(client: SupabaseClient | null, projectId: string | null) {
  return useQuery<PortalTimelineEvent[]>({
    queryKey: ['portal-timeline', projectId],
    queryFn: async () => {
      if (!client || !projectId) return [];
      return fetchPortalTimeline(client, projectId);
    },
    enabled: Boolean(client && projectId),
  });
}
