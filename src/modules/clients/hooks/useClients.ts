import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '../../../lib/supabase/queries/clients';
import type { ClientQueryFilter, PaginatedClientsResult } from '../../../types/client';

export function useClients(filter: ClientQueryFilter = {}) {
  return useQuery<PaginatedClientsResult, Error>({
    queryKey: ['clients', filter],
    queryFn: () => fetchClients(filter),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export default useClients;
