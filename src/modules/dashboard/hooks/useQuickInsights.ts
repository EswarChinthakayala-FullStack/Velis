import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';
import type { InsightItem } from '../types';

export function useQuickInsights() {
  return useQuery<InsightItem[], Error>({
    queryKey: ['dashboard', 'quickInsights'],
    queryFn: async () => {
      const [reviewRes, shareRes] = await Promise.allSettled([
        (supabase as any).from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'review'),
        (supabase as any).from('share_links').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      const reviewCount = reviewRes.status === 'fulfilled' && !reviewRes.value.error ? (reviewRes.value.count ?? 0) : 0;
      const activeShareLinks = shareRes.status === 'fulfilled' && !shareRes.value.error ? (shareRes.value.count ?? 0) : 0;

      return [
        {
          id: 'ins-1',
          title: `${reviewCount} deliverables pending client review.`,
          category: 'warning',
          actionLabel: 'Review Tasks',
          actionRoute: '/app/tasks',
        },
        {
          id: 'ins-2',
          title: 'GitHub repositories synced cleanly.',
          category: 'success',
          actionLabel: 'View Repos',
          actionRoute: '/app/github',
        },
        {
          id: 'ins-3',
          title: `${activeShareLinks} active client share links generating analytics.`,
          category: 'info',
          actionLabel: 'Manage Links',
          actionRoute: '/app/share-links',
        },
      ];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export default useQuickInsights;
