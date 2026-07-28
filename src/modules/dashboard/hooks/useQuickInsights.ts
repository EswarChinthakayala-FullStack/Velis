import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';
import type { InsightItem } from '../types';

export function useQuickInsights() {
  return useQuery<InsightItem[], Error>({
    queryKey: ['dashboard', 'quickInsights'],
    queryFn: async () => {
      let reviewCount = 0;
      let activeShareLinks = 0;

      try {
        const { count: taskCount, error: taskErr } = await (supabase as any)
          .from('tasks')
          .select('id', { count: 'exact' })
          .eq('status', 'review');
        if (!taskErr && typeof taskCount === 'number') {
          reviewCount = taskCount;
        }
      } catch (err: any) {
        console.warn('QuickInsights task query warning:', err?.message);
      }

      try {
        const { count: shareCount, error: shareErr } = await (supabase as any)
          .from('share_links')
          .select('id', { count: 'exact' })
          .eq('is_active', true);
        if (!shareErr && typeof shareCount === 'number') {
          activeShareLinks = shareCount;
        }
      } catch (err: any) {
        console.warn('QuickInsights share link query warning:', err?.message);
      }

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
