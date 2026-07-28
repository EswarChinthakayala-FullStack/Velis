import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchPortalFiles } from '../lib/supabase/queries/portal';
import type { PortalFile } from '../lib/types/portal';

export function usePortalFiles(client: SupabaseClient | null, projectId: string | null) {
  return useQuery<PortalFile[]>({
    queryKey: ['portal-files', projectId],
    queryFn: async () => {
      if (!client || !projectId) return [];
      return fetchPortalFiles(client, projectId);
    },
    enabled: Boolean(client && projectId),
  });
}
