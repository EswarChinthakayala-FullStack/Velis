import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationRead, markAllNotificationsRead } from '../lib/supabase/queries/notifications';

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  const markSingle = useMutation({
    mutationFn: ({ id, readStatus }: { id: string; readStatus: boolean }) =>
      markNotificationRead(id, readStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    markSingle,
    markAll,
  };
}
