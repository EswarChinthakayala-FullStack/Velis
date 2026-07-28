import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClientRecord } from '../../../lib/supabase/queries/clients';
import type { ClientFormValues } from '../schemas/client.schema';
import type { ClientRecord } from '../../../types/client';

interface UpdateClientParams {
  id: string;
  values: ClientFormValues;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation<ClientRecord, Error, UpdateClientParams>({
    mutationFn: ({ id, values }) => updateClientRecord(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-details', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-active-clients'] });
    },
  });
}

export default useUpdateClient;
