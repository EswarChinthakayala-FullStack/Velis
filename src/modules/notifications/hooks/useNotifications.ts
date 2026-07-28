import { useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '../lib/supabase/queries/notifications';
import type { NotificationFilterState } from '../types/notification';

export function useNotifications(
  filters: NotificationFilterState,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => fetchNotifications(filters),
    staleTime: 1000 * 60,
    enabled: options?.enabled ?? true,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
