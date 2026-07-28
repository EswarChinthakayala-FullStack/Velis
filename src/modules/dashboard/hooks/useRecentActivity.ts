import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';

export interface ActivityRecord {
  id: string;
  actorId?: string;
  actorName: string;
  actorAvatar?: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityName: string;
  projectName?: string;
  createdAt: string;
}

export function useRecentActivity() {
  return useQuery<ActivityRecord[], Error>({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      try {
        const { data: logs, error } = await (supabase as any)
          .from('activity_logs')
          .select('id, actor_id, action, entity_type, entity_id, metadata, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error || !logs) {
          return [];
        }

        const actorIds = Array.from(new Set(logs.map((l: any) => l.actor_id).filter(Boolean)));
        const profileMap: Record<string, { full_name?: string; avatar_url?: string }> = {};

        if (actorIds.length > 0) {
          try {
            const { data: profiles } = await (supabase as any)
              .from('profiles')
              .select('id, full_name, avatar_url')
              .in('id', actorIds);

            (profiles || []).forEach((p: any) => {
              profileMap[String(p.id)] = { full_name: p.full_name, avatar_url: p.avatar_url };
            });
          } catch {
            // Fallback
          }
        }

        return logs.map((log: any) => {
          const profile = log.actor_id ? profileMap[String(log.actor_id)] : undefined;
          const metadata = log.metadata || {};
          const actorName = profile?.full_name || metadata.actor_name || 'System Admin';
          const entityName = metadata.entity_name || metadata.title || log.entity_type || 'Workspace Item';

          return {
            id: String(log.id),
            actorId: log.actor_id ? String(log.actor_id) : undefined,
            actorName,
            actorAvatar: profile?.avatar_url || metadata.actor_avatar,
            action: log.action || 'updated',
            entityType: log.entity_type || 'project',
            entityId: log.entity_id ? String(log.entity_id) : undefined,
            entityName,
            projectName: metadata.project_name,
            createdAt: log.created_at,
          };
        });
      } catch (err: any) {
        console.warn('Activity log query warning:', err?.message);
        return [];
      }
    },
    staleTime: 1000 * 60 * 2,
  });
}

export default useRecentActivity;
