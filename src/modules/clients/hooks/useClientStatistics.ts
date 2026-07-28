import { useQuery } from '@tanstack/react-query';
import { fetchClientStats } from '../../../lib/supabase/queries/clients';
import type { ClientStats } from '../../../types/client';

export function useClientStatistics(clientId?: string) {
  return useQuery<ClientStats, Error>({
    queryKey: ['client-stats', clientId],
    queryFn: () => {
      if (!clientId) throw new Error('Client ID is required');
      return fetchClientStats(clientId);
    },
    enabled: Boolean(clientId),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export default useClientStatistics;
