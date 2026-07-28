import { useState, useMemo } from 'react';
import type { TaskItem, TaskFilterState, TaskPriority, TaskStatus } from '../lib/types/task';
import { isToday, isTomorrow, isThisWeek, isBefore, parseISO, startOfDay } from 'date-fns';

export function useTaskFilters(tasks: TaskItem[]) {
  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    projectId: 'all',
    module: 'all',
    priority: 'all',
    status: 'all',
    dueDate: 'all',
  });

  const setSearch = (search: string) => setFilters((prev) => ({ ...prev, search }));
  const setProjectId = (projectId: string) => setFilters((prev) => ({ ...prev, projectId }));
  const setModule = (module: string) => setFilters((prev) => ({ ...prev, module }));
  const setPriority = (priority: 'all' | TaskPriority) => setFilters((prev) => ({ ...prev, priority }));
  const setStatus = (status: 'all' | TaskStatus) => setFilters((prev) => ({ ...prev, status }));
  const setDueDate = (dueDate: 'all' | 'today' | 'tomorrow' | 'this_week' | 'overdue') => setFilters((prev) => ({ ...prev, dueDate }));
  const resetFilters = () => setFilters({ search: '', projectId: 'all', module: 'all', priority: 'all', status: 'all', dueDate: 'all' });

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((item) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        const matchProject = (item.projectName || '').toLowerCase().includes(q);
        const matchModule = (item.module || '').toLowerCase().includes(q);
        const matchLabels = item.labels.some((l) => l.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchProject && !matchModule && !matchLabels) return false;
      }

      // 2. Project Filter
      if (filters.projectId !== 'all' && item.projectId !== filters.projectId) {
        return false;
      }

      // 3. Module Filter
      if (filters.module !== 'all' && item.module !== filters.module) {
        return false;
      }

      // 4. Priority Filter
      if (filters.priority !== 'all' && item.priority !== filters.priority) {
        return false;
      }

      // 5. Status Filter
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }

      // 6. Due Date Filter
      if (filters.dueDate !== 'all') {
        if (!item.dueDate) return false;
        try {
          const due = parseISO(item.dueDate);
          const todayStart = startOfDay(new Date());

          if (filters.dueDate === 'today' && !isToday(due)) return false;
          if (filters.dueDate === 'tomorrow' && !isTomorrow(due)) return false;
          if (filters.dueDate === 'this_week' && !isThisWeek(due)) return false;
          if (filters.dueDate === 'overdue' && (item.status === 'completed' || !isBefore(due, todayStart))) return false;
        } catch {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  // Extract unique module names from task list for filter dropdown
  const availableModules = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.module) set.add(t.module);
    });
    return Array.from(set).sort();
  }, [tasks]);

  return {
    filters,
    setSearch,
    setProjectId,
    setModule,
    setPriority,
    setStatus,
    setDueDate,
    resetFilters,
    filteredTasks,
    availableModules,
  };
}

export default useTaskFilters;
