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
        const { data: projects, error } = await (supabase as any)
          .from('projects')
          .select('id, client_id');

        if (error || !projects) {
          console.warn('Client distribution query warning:', error?.message);
          return [];
        }

        const clientIds = Array.from(new Set(projects.map((p: any) => p.client_id).filter(Boolean)));
        const clientNames: Record<string, string> = {};

        if (clientIds.length > 0) {
          try {
            const { data: clientsData } = await (supabase as any)
              .from('clients')
              .select('id, name')
              .in('id', clientIds);

            (clientsData || []).forEach((c: any) => {
              clientNames[String(c.id)] = String(c.name);
            });
          } catch {
            // Fallback
          }
        }

        const clientCounts: Record<string, number> = {};

        projects.forEach((p: any) => {
          const clientName = p.client_id ? clientNames[String(p.client_id)] || 'Internal / Direct' : 'Internal / Direct';
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
