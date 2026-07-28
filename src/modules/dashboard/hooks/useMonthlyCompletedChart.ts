import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';

export interface MonthlyCompletedData {
  month: string;
  completedCount: number;
}

export function useMonthlyCompletedChart() {
  return useQuery<MonthlyCompletedData[], Error>({
    queryKey: ['dashboard-chart-monthly-completed'],
    queryFn: async () => {
      // Query completed projects first
      const { data: completedData, error: compErr } = await (supabase as any)
        .from('projects')
        .select('updated_at, created_at, status')
        .eq('status', 'completed');

      if (compErr) throw compErr;

      // If no completed projects, fallback to all project delivery timeline dates
      let rawProjects = completedData || [];
      if (rawProjects.length === 0) {
        const { data: allProjects } = await (supabase as any)
          .from('projects')
          .select('updated_at, created_at, status');
        rawProjects = allProjects || [];
      }

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const monthBuckets: Record<string, number> = {};
      const bucketOrder: string[] = [];

      // Generate trailing 12 month labels (e.g., Aug, Sep, ..., Jul)
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
        monthBuckets[label] = 0;
        bucketOrder.push(label);
      }

      rawProjects.forEach((p: any) => {
        const dateStr = p.updated_at || p.created_at;
        if (dateStr) {
          const date = new Date(dateStr);
          const label = `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
          if (monthBuckets[label] !== undefined) {
            monthBuckets[label] += 1;
          }
        }
      });

      return bucketOrder.map((label) => ({
        month: label,
        completedCount: monthBuckets[label] || 0,
      }));
    },
    staleTime: 1000 * 60 * 3,
  });
}

export default useMonthlyCompletedChart;
