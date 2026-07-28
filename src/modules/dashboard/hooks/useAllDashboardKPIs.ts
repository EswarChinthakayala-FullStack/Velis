import { useQuery } from '@tanstack/react-query';
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

/**
 * useAllDashboardKPIs
 * Disabled database querying for KPI cards as requested.
 * Instantly returns formatSummary with zero network requests.
 */
export function useAllDashboardKPIs() {
  return useQuery<DashboardKPIsSummary, Error>({
    queryKey: ['dashboard', 'all-kpis-summary'],
    queryFn: async () => {
      return formatSummary({
        activeProjectsCount: 0,
        completedProjectsCount: 0,
        onHoldProjectsCount: 0,
        upcomingDeadlinesCount: 0,
        overdueTasksCount: 0,
        activeClientsCount: 0,
        repositoryCountVal: 0,
        activeShareLinksCount: 0,
      });
    },
    staleTime: Infinity,
    enabled: false,
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
      trend: '0',
      trendType: 'neutral',
      icon: FolderCheckIcon,
      updatedAt: nowStr,
    },
    completedProjects: {
      id: 'kpi-completed-projects',
      title: 'Completed Projects',
      value: counts.completedProjectsCount,
      label: 'Delivered successfully',
      trend: '0',
      trendType: 'positive',
      icon: CheckmarkCircle01Icon,
      updatedAt: nowStr,
    },
    onHoldProjects: {
      id: 'kpi-on-hold-projects',
      title: 'On Hold Projects',
      value: counts.onHoldProjectsCount,
      label: 'Paused or pending input',
      trend: '0',
      trendType: 'neutral',
      icon: Time01Icon,
      updatedAt: nowStr,
    },
    upcomingDeadlines: {
      id: 'kpi-upcoming-deadlines',
      title: 'Upcoming Deadlines',
      value: counts.upcomingDeadlinesCount,
      label: 'Due in next 7 days',
      trend: 'All clear',
      trendType: 'live',
      icon: Calendar01Icon,
      updatedAt: nowStr,
    },
    overdueTasks: {
      id: 'kpi-overdue-tasks',
      title: 'Overdue Tasks',
      value: counts.overdueTasksCount,
      label: 'Action required',
      trend: 'All clear',
      trendType: 'positive',
      icon: AlertCircleIcon,
      updatedAt: nowStr,
    },
    activeClients: {
      id: 'kpi-active-clients',
      title: 'Active Clients',
      value: counts.activeClientsCount,
      label: 'Managed organizations',
      trend: '0',
      trendType: 'neutral',
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
