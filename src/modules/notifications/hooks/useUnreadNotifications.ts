import { useQuery } from '@tanstack/react-query';
import { fetchUnreadCount } from '../lib/supabase/queries/notifications';

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    staleTime: 1000 * 60,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
