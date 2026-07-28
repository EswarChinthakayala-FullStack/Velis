import { useQuery } from '@tanstack/react-query';
import { fetchClientProjects } from '../../../lib/supabase/queries/clients';
import type { ClientProject } from '../../../types/client';

export function useClientProjects(clientId?: string) {
  return useQuery<ClientProject[], Error>({
    queryKey: ['client-projects', clientId],
    queryFn: () => {
      if (!clientId) throw new Error('Client ID is required');
      return fetchClientProjects(clientId);
    },
    enabled: Boolean(clientId),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export default useClientProjects;
