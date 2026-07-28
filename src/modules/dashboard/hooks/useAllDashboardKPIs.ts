import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase/client';
import type { KPICardData } from '../types';
import {
  FolderCheckIcon,
  CheckmarkCircle01Icon,
  Time01Icon,
  Calendar01Icon,
  AlertCircleIcon,
  UserGroupIcon,
  GitBranchIcon,
  Link01Icon,
} from '@hugeicons/core-free-icons';

export interface DashboardKPIsSummary {
  activeProjects: KPICardData;
  completedProjects: KPICardData;
  onHoldProjects: KPICardData;
  upcomingDeadlines: KPICardData;
  overdueTasks: KPICardData;
  activeClients: KPICardData;
  repositoryCount: KPICardData;
  activeShareLinks: KPICardData;
}

export function useAllDashboardKPIs() {
  return useQuery<DashboardKPIsSummary, Error>({
    queryKey: ['dashboard', 'all-kpis-summary'],
    queryFn: async () => {
      let activeProjectsCount = 0;
      let completedProjectsCount = 0;
      let onHoldProjectsCount = 0;
      let upcomingDeadlinesCount = 0;
      let overdueTasksCount = 0;
      let activeClientsCount = 0;
      let repositoryCountVal = 0;
      let activeShareLinksCount = 0;

      // 1. Try High-Performance Single RPC Function Call First
      try {
        const { data: rpcData, error: rpcError } = await (supabase as any).rpc('get_dashboard_kpis');
        if (!rpcError && rpcData) {
          activeProjectsCount = Number(rpcData.active_projects ?? 0);
          completedProjectsCount = Number(rpcData.completed_projects ?? 0);
          onHoldProjectsCount = Number(rpcData.on_hold_projects ?? 0);
          upcomingDeadlinesCount = Number(rpcData.upcoming_deadlines ?? 0);
          overdueTasksCount = Number(rpcData.overdue_tasks ?? 0);
          activeClientsCount = Number(rpcData.active_clients ?? 0);
          repositoryCountVal = Number(rpcData.repository_count ?? 0);
          activeShareLinksCount = Number(rpcData.active_share_links ?? 0);

          return formatSummary({
            activeProjectsCount,
            completedProjectsCount,
            onHoldProjectsCount,
            upcomingDeadlinesCount,
            overdueTasksCount,
            activeClientsCount,
            repositoryCountVal,
            activeShareLinksCount,
          });
        }
      } catch {
        // Fall back to batch query if RPC is not deployed yet on remote DB
      }

      // 2. Resilient Batch Fallback (Promise.allSettled)
      const now = new Date().toISOString();
      const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const today = new Date().toISOString().split('T')[0];

      const [
        activeProjRes,
        completedProjRes,
        onHoldProjRes,
        deadlinesRes,
        overdueTasksRes,
        clientsRes,
        reposRes,
        shareLinksRes,
      ] = await Promise.allSettled([
        (supabase as any).from('projects').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        (supabase as any).from('projects').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        (supabase as any).from('projects').select('id', { count: 'exact', head: true }).eq('status', 'on_hold'),
        (supabase as any).from('projects').select('id', { count: 'exact', head: true }).gt('deadline', now).lte('deadline', in7Days),
        (supabase as any).from('tasks').select('id', { count: 'exact', head: true }).lt('due_date', today).neq('status', 'completed'),
        (supabase as any).from('clients').select('id', { count: 'exact', head: true }),
        (supabase as any).from('github_repositories').select('id', { count: 'exact', head: true }),
        (supabase as any).from('share_links').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      const getCount = (res: PromiseSettledResult<any>): number =>
        res.status === 'fulfilled' && res.value && !res.value.error ? (res.value.count ?? 0) : 0;

      return formatSummary({
        activeProjectsCount: getCount(activeProjRes),
        completedProjectsCount: getCount(completedProjRes),
        onHoldProjectsCount: getCount(onHoldProjRes),
        upcomingDeadlinesCount: getCount(deadlinesRes),
        overdueTasksCount: getCount(overdueTasksRes),
        activeClientsCount: getCount(clientsRes),
        repositoryCountVal: getCount(reposRes),
        activeShareLinksCount: getCount(shareLinksRes),
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
}

function formatSummary(counts: {
  activeProjectsCount: number;
  completedProjectsCount: number;
  onHoldProjectsCount: number;
  upcomingDeadlinesCount: number;
  overdueTasksCount: number;
  activeClientsCount: number;
  repositoryCountVal: number;
  activeShareLinksCount: number;
}): DashboardKPIsSummary {
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    activeProjects: {
      id: 'kpi-active-projects',
      title: 'Active Projects',
      value: counts.activeProjectsCount,
      label: 'Currently in progress',
      trend: '+2 this month',
      trendType: 'positive',
      icon: FolderCheckIcon,
      updatedAt: nowStr,
    },
    completedProjects: {
      id: 'kpi-completed-projects',
      title: 'Completed Projects',
      value: counts.completedProjectsCount,
      label: 'Delivered successfully',
      trend: '100% SLA',
      trendType: 'positive',
      icon: CheckmarkCircle01Icon,
      updatedAt: nowStr,
    },
    onHoldProjects: {
      id: 'kpi-on-hold-projects',
      title: 'On Hold Projects',
      value: counts.onHoldProjectsCount,
      label: 'Paused or pending input',
      trend: '0 this week',
      trendType: 'neutral',
      icon: Time01Icon,
      updatedAt: nowStr,
    },
    upcomingDeadlines: {
      id: 'kpi-upcoming-deadlines',
      title: 'Upcoming Deadlines',
      value: counts.upcomingDeadlinesCount,
      label: 'Due in next 7 days',
      trend: 'On track',
      trendType: 'live',
      icon: Calendar01Icon,
      updatedAt: nowStr,
    },
    overdueTasks: {
      id: 'kpi-overdue-tasks',
      title: 'Overdue Tasks',
      value: counts.overdueTasksCount,
      label: 'Action required',
      trend: counts.overdueTasksCount > 0 ? 'Requires attention' : 'All clear',
      trendType: counts.overdueTasksCount > 0 ? 'negative' : 'positive',
      icon: AlertCircleIcon,
      updatedAt: nowStr,
    },
    activeClients: {
      id: 'kpi-active-clients',
      title: 'Active Clients',
      value: counts.activeClientsCount,
      label: 'Managed organizations',
      trend: '+1 new',
      trendType: 'positive',
      icon: UserGroupIcon,
      updatedAt: nowStr,
    },
    repositoryCount: {
      id: 'kpi-repositories',
      title: 'Connected Repositories',
      value: counts.repositoryCountVal,
      label: 'GitHub codebases linked',
      trend: 'Synced',
      trendType: 'positive',
      icon: GitBranchIcon,
      updatedAt: nowStr,
    },
    activeShareLinks: {
      id: 'kpi-share-links',
      title: 'Active Share Links',
      value: counts.activeShareLinksCount,
      label: 'Client portal tokens',
      trend: 'Live',
      trendType: 'live',
      icon: Link01Icon,
      updatedAt: nowStr,
    },
  };
}

export default useAllDashboardKPIs;
