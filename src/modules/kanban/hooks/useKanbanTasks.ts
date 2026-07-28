import { useMemo } from 'react';
import { useTasks } from '../../tasks/hooks/useTasks';
import type { TaskItem, TaskStatus } from '../../tasks/lib/types/task';
import type { KanbanGroupedTasks } from '../lib/types/kanban';

export function useKanbanTasks(projectId?: string) {
  const { tasks, isLoading, isError, error, refetch } = useTasks(projectId);

  const groupedTasks = useMemo<KanbanGroupedTasks>(() => {
    const groups: KanbanGroupedTasks = {
      todo: [],
      in_progress: [],
      review: [],
      testing: [],
      completed: [],
    };

    tasks.forEach((t) => {
      const statusKey = (t.status || 'todo') as TaskStatus;
      if (groups[statusKey]) {
        groups[statusKey].push(t);
      } else {
        groups.todo.push(t);
      }
    });

    // Sort each column by sortOrder ascending, then created_at
    (Object.keys(groups) as TaskStatus[]).forEach((key) => {
      groups[key].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    });

    return groups;
  }, [tasks]);

  return {
    tasks,
    groupedTasks,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export default useKanbanTasks;
