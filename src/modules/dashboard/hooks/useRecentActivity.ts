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
      // 1. Try querying activity_logs table first
      const { data: logs, error } = await (supabase as any)
        .from('activity_logs')
        .select('id, actor_id, action, entity_type, entity_id, metadata, created_at, profiles!actor_id(full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && logs && logs.length > 0) {
        return logs.map((log: any) => {
          const profile = log.profiles;
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

      // 2. Fallback: Synthesize recent activity stream directly from projects, repos & tasks
      const synthesized: ActivityRecord[] = [];

      // Fetch recent projects
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

      // Fetch recent GitHub repositories (using exact column last_synced_at)
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

      // Fetch recent Tasks
      const { data: tasks } = await (supabase as any)
        .from('tasks')
        .select('id, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(4);

      (tasks || []).forEach((t: any) => {
        synthesized.push({
          id: `act-task-${t.id}`,
          actorName: 'Admin',
          action: 'task_created',
          entityType: 'task',
          entityId: String(t.id),
          entityName: String(t.title),
          createdAt: t.created_at || new Date().toISOString(),
        });
      });

      // Sort synthesized list newest first
      synthesized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return synthesized;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export default useRecentActivity;
