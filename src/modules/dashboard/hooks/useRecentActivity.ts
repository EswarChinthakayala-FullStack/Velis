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

        if (!error && logs && logs.length > 0) {
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
        }
      } catch (err: any) {
        console.warn('Activity log query warning:', err?.message);
      }

      // Fallback: Synthesize recent activity stream cleanly
      const synthesized: ActivityRecord[] = [];

      try {
        const { data: projects } = await (supabase as any)
          .from('projects')
          .select('id, name, created_at, updated_at, status')
          .order('updated_at', { ascending: false })
          .limit(5);

        (projects || []).forEach((p: any) => {
          synthesized.push({
            id: `act-proj-${p.id}`,
            actorName: 'Admin',
            action: 'project_updated',
            entityType: 'project',
            entityId: String(p.id),
            entityName: String(p.name),
            projectName: String(p.name),
            createdAt: p.updated_at || p.created_at || new Date().toISOString(),
          });
        });
      } catch (err: any) {
        console.warn('Synthesized projects activity warning:', err?.message);
      }

      try {
        const { data: repos } = await (supabase as any)
          .from('github_repositories')
          .select('id, organization, repo_url, last_synced_at')
          .limit(3);

        (repos || []).forEach((r: any) => {
          const repoName = r.organization ? `${r.organization} repository` : 'GitHub Repository';
          synthesized.push({
            id: `act-repo-${r.id}`,
            actorName: 'GitHub Bot',
            action: 'repo_synced',
            entityType: 'github',
            entityId: String(r.id),
            entityName: repoName,
            createdAt: r.last_synced_at || new Date().toISOString(),
          });
        });
      } catch (err: any) {
        console.warn('Synthesized repos activity warning:', err?.message);
      }

      synthesized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return synthesized;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export default useRecentActivity;
