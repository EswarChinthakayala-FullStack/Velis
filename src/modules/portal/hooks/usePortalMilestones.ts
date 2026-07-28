import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchPortalMilestones } from '../lib/supabase/queries/portal';
import type { PortalMilestone } from '../lib/types/portal';

export function usePortalMilestones(client: SupabaseClient | null, projectId: string | null) {
  return useQuery<PortalMilestone[]>({
    queryKey: ['portal-milestones', projectId],
    queryFn: async () => {
      if (!client || !projectId) return [];
      return fetchPortalMilestones(client, projectId);
    },
    enabled: Boolean(client && projectId),
  });
}
