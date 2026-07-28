import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClientRecord } from '../../../lib/supabase/queries/clients';

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (clientId) => deleteClientRecord(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-active-clients'] });
    },
  });
}

export default useDeleteClient;
