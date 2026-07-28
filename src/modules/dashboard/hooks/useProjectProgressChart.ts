import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';

export interface ProjectProgressData {
  id: string;
  name: string;
  completionPercent: number;
  color: string;
}

export function useProjectProgressChart() {
  return useQuery<ProjectProgressData[], Error>({
    queryKey: ['dashboard-chart-project-progress'],
    queryFn: async () => {
      // Query ongoing projects (neq completed) ordered by completion_percent desc
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('id, name, completion_percent, color, status')
        .neq('status', 'completed')
        .order('completion_percent', { ascending: false });

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: String(p.id),
        name: String(p.name),
        completionPercent: Number(p.completion_percent ?? 0),
        color: p.color || '#71717A',
      }));
    },
    staleTime: 1000 * 60 * 3,
  });
}

export default useProjectProgressChart;
