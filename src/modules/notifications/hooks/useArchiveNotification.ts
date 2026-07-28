import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveNotification } from '../lib/supabase/queries/notifications';

export function useArchiveNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, archived }: { id: string; archived?: boolean }) =>
      archiveNotification(id, archived),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
