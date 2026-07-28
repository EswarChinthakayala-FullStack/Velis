import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNotification } from '../lib/supabase/queries/notifications';

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
