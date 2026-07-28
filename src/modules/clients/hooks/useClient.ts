import { useQuery } from '@tanstack/react-query';
import { fetchClientById } from '../../../lib/supabase/queries/clients';
import type { ClientRecord } from '../../../types/client';

export function useClient(clientId?: string) {
  return useQuery<ClientRecord, Error>({
    queryKey: ['client-details', clientId],
    queryFn: () => {
      if (!clientId) throw new Error('Client ID is required');
      return fetchClientById(clientId);
    },
    enabled: Boolean(clientId),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export default useClient;
