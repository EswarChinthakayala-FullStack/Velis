import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';

export interface ClientDistributionData {
  clientName: string;
  projectCount: number;
}

export function useClientDistributionChart() {
  return useQuery<ClientDistributionData[], Error>({
    queryKey: ['dashboard-chart-client-distribution'],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('projects')
          .select('id, client_id, clients(name)');

        if (error) {
          console.warn('Client distribution query warning:', error.message);
          return [];
        }

        const clientCounts: Record<string, number> = {};

        (data || []).forEach((p: any) => {
          const clientName = p.clients?.name || 'Internal / Direct';
          clientCounts[clientName] = (clientCounts[clientName] || 0) + 1;
        });

        return Object.entries(clientCounts)
          .map(([clientName, projectCount]) => ({ clientName, projectCount }))
          .sort((a, b) => b.projectCount - a.projectCount);
      } catch (err: any) {
        console.warn('Client distribution query network drop:', err?.message);
        return [];
      }
    },
    staleTime: 1000 * 60 * 3,
  });
}

export default useClientDistributionChart;
