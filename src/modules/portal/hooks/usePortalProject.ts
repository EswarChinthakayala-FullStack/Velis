import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchPortalProject } from '../lib/supabase/queries/portal';
import type { PortalProject } from '../lib/types/portal';

export function usePortalProject(client: SupabaseClient | null, projectId: string | null) {
  return useQuery<PortalProject | null>({
    queryKey: ['portal-project', projectId],
    queryFn: async () => {
      if (!client || !projectId) return null;
      return fetchPortalProject(client, projectId);
    },
    enabled: Boolean(client && projectId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
