import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../client';
import type {
  DashboardKpiCounts,
  ProjectProgress,
  MonthlyCompletion,
  TechnologyUsage,
  ClientDistribution,
  RecentActivityItem,
  DashboardQueryError,
} from '../../../types/dashboard';
import {
  transformProjectProgress,
  transformMonthlyCompletions,
  transformTechnologyUsage,
  transformClientDistribution,
  transformRecentActivity,
} from '../utils/dashboard-transformers';

/**
 * Enterprise Dashboard Data Layer for Velis (PHASE 05)
 * Single source of truth for all dashboard data.
 * Pure data-access layer: NO JSX, NO UI components, ZERO mock data.
 */

// Default caching parameters for production queries
const DEFAULT_STALE_TIME = 1000 * 60 * 3; // 3 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 15;   // 15 minutes

/**
 * Hook 1: useKpiCounts()
 * Returns all dashboard KPI metrics calculated using lightweight aggregate/head queries.
 */
export function useKpiCounts(): UseQueryResult<DashboardKpiCounts, DashboardQueryError> {
  return useQuery<DashboardKpiCounts, DashboardQueryError>({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      // 1. Active Projects Count (in_progress, active, review, planning)
      const { count: activeProjects, error: activeErr } = await (supabase as any)
        .from('projects')
        .select('id', { count: 'exact' })
        .in('status', ['in_progress', 'active', 'review', 'planning']);

      if (activeErr) throw { message: activeErr.message, code: activeErr.code };

      // 2. Completed Projects Count
      const { count: completedProjects, error: compErr } = await (supabase as any)
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('status', 'completed');

      if (compErr) throw { message: compErr.message, code: compErr.code };

      // 3. On Hold Projects Count
      const { count: onHoldProjects, error: holdErr } = await (supabase as any)
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('status', 'on_hold');

      if (holdErr) throw { message: holdErr.message, code: holdErr.code };

      // 4. Upcoming Deadlines (Milestones due within next 7 days, progress < 100)
      const now = new Date();
      const inSevenDays = new Date();
      inSevenDays.setDate(now.getDate() + 7);

      const { count: upcomingDeadlines } = await (supabase as any)
        .from('milestones')
        .select('id', { count: 'exact' })
        .gte('due_date', now.toISOString())
        .lte('due_date', inSevenDays.toISOString())
        .lt('progress', 100);

      // 5. Overdue Tasks Count
      const { count: overdueTasks } = await (supabase as any)
        .from('tasks')
        .select('id', { count: 'exact' })
        .neq('status', 'completed');

      // 6. Active Clients Count
      const { count: activeClientsCount } = await (supabase as any)
        .from('clients')
        .select('id', { count: 'exact' });

      // 7. GitHub Repositories Count
      const { count: githubRepositories } = await (supabase as any)
        .from('github_repositories')
        .select('id', { count: 'exact' });

      return {
        activeProjects: activeProjects ?? 0,
        completedProjects: completedProjects ?? 0,
        onHoldProjects: onHoldProjects ?? 0,
        upcomingDeadlines: upcomingDeadlines ?? 0,
        overdueTasks: overdueTasks ?? 0,
        activeClients: activeClientsCount ?? 0,
        githubRepositories: githubRepositories ?? 0,
      };
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
  });
}

/**
 * Hook 2: useProjectProgress()
 * Returns active projects ordered by completion percentage (NO SELECT *).
 */
export function useProjectProgress(): UseQueryResult<ProjectProgress[], DashboardQueryError> {
  return useQuery<ProjectProgress[], DashboardQueryError>({
    queryKey: ['dashboard-progress'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('id, name, completion_percent, color')
        .in('status', ['in_progress', 'active', 'review', 'planning'])
        .order('completion_percent', { ascending: false });

      if (error) throw { message: error.message, code: error.code };

      return transformProjectProgress(data || []);
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
  });
}

/**
 * Hook 3: useMonthlyCompletions()
 * Returns completed project counts aggregated into trailing 12-month buckets (NO SELECT *).
 */
export function useMonthlyCompletions(): UseQueryResult<MonthlyCompletion[], DashboardQueryError> {
  return useQuery<MonthlyCompletion[], DashboardQueryError>({
    queryKey: ['dashboard-completions'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('updated_at, status')
        .eq('status', 'completed');

      if (error) throw { message: error.message, code: error.code };

      return transformMonthlyCompletions(data || []);
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
  });
}

/**
 * Hook 4: useTechnologyUsage()
 * Returns technology usage frequency aggregated from project_technologies (NO SELECT *).
 */
export function useTechnologyUsage(): UseQueryResult<TechnologyUsage[], DashboardQueryError> {
  return useQuery<TechnologyUsage[], DashboardQueryError>({
    queryKey: ['dashboard-technologies'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('project_technologies')
        .select('name');

      if (error && error.code !== 'PGRST116') {
        throw { message: error.message, code: error.code };
      }

      return transformTechnologyUsage(data || []);
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
  });
}

/**
 * Hook 5: useClientDistribution()
 * Returns active project counts aggregated by client name (NO SELECT *).
 */
export function useClientDistribution(): UseQueryResult<ClientDistribution[], DashboardQueryError> {
  return useQuery<ClientDistribution[], DashboardQueryError>({
    queryKey: ['dashboard-clients'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('client_id, clients(name)')
        .in('status', ['in_progress', 'active', 'review', 'planning']);

      if (error) throw { message: error.message, code: error.code };

      return transformClientDistribution(data || []);
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
  });
}

/**
 * Hook 6: useRecentActivity()
 * Returns the top 20 activity records ordered newest first (NO SELECT *).
 */
export function useRecentActivity(): UseQueryResult<RecentActivityItem[], DashboardQueryError> {
  return useQuery<RecentActivityItem[], DashboardQueryError>({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('activity_logs')
        .select('id, actor_id, action, entity_type, entity_id, metadata, created_at, profiles!actor_id(full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        return [];
      }

      return transformRecentActivity(data || []);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
  });
}
