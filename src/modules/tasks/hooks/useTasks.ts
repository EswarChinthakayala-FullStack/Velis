import { useQuery } from '@tanstack/react-query';
import { fetchTasks, TASK_QUERY_KEYS } from '../../../lib/supabase/queries/tasks';
import type { TaskItem, TaskKpis } from '../lib/types/task';
import { isBefore, parseISO, startOfDay } from 'date-fns';

export function useTasks(projectId?: string) {
  const query = useQuery<TaskItem[]>({
    queryKey: TASK_QUERY_KEYS.list(projectId),
    queryFn: async (): Promise<TaskItem[]> => {
      return await fetchTasks(projectId);
    },
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 10,   // 10 minutes garbage collection
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const tasks = query.data || [];

  // Calculate live KPI statistics
  const kpis: TaskKpis = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    review: tasks.filter((t) => t.status === 'review' || t.status === 'testing').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => {
      if (t.status === 'completed' || !t.dueDate) return false;
      try {
        const due = parseISO(t.dueDate);
        return isBefore(due, startOfDay(new Date()));
      } catch {
        return false;
      }
    }).length,
  };

  return {
    ...query,
    tasks,
    kpis,
  };
}

export default useTasks;
