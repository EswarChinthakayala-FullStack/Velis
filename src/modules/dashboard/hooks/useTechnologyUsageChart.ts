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
      const { data, error } = await (supabase as any)
        .from('project_technologies')
        .select('name');

      if (error && error.code !== 'PGRST116') throw error;

      const techCounts: Record<string, number> = {};

      (data || []).forEach((t: { name: string }) => {
        if (t.name) {
          techCounts[t.name] = (techCounts[t.name] || 0) + 1;
        }
      });

      return Object.entries(techCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export default useTechnologyUsageChart;
