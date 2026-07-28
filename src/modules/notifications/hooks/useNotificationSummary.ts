import { useQuery } from '@tanstack/react-query';
import { fetchNotificationSummary } from '../lib/supabase/queries/notifications';

export function useNotificationSummary() {
  return useQuery({
    queryKey: ['notifications', 'summary'],
    queryFn: fetchNotificationSummary,
    staleTime: 1000 * 60,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
