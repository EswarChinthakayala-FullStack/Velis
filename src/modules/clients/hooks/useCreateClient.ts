import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientRecord } from '../../../lib/supabase/queries/clients';
import type { ClientFormValues } from '../schemas/client.schema';
import type { ClientRecord } from '../../../types/client';

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation<ClientRecord, Error, ClientFormValues>({
    mutationFn: (input) => createClientRecord(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-active-clients'] });
    },
  });
}

export default useCreateClient;
