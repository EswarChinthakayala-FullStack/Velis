import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';

export interface TechUsageData {
  name: string;
  count: number;
}

export function useTechnologyUsageChart() {
  return useQuery<TechUsageData[], Error>({
    queryKey: ['dashboard-chart-technology-usage'],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('project_technologies')
          .select('name');

        if (error) {
          console.warn('Technology usage query warning:', error.message);
          return [];
        }

        const techCounts: Record<string, number> = {};

        (data || []).forEach((t: { name: string }) => {
          if (t.name) {
            techCounts[t.name] = (techCounts[t.name] || 0) + 1;
          }
        });

        return Object.entries(techCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
      } catch (err: any) {
        console.warn('Technology usage network drop:', err?.message);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export default useTechnologyUsageChart;
