import type { TaskStatus } from '../../../tasks/lib/types/task';
import type { KanbanColumnConfig } from '../types/kanban';

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    id: 'todo',
    title: 'Todo',
    badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700/80',
    headerColor: 'border-zinc-700',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    headerColor: 'border-amber-500/40',
  },
  {
    id: 'review',
    title: 'In Review',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    headerColor: 'border-purple-500/40',
  },
  {
    id: 'testing',
    title: 'Testing',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    headerColor: 'border-cyan-500/40',
  },
  {
    id: 'completed',
    title: 'Completed',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    headerColor: 'border-emerald-500/40',
  },
];

export function getColumnConfig(status: TaskStatus): KanbanColumnConfig {
  return KANBAN_COLUMNS.find((c) => c.id === status) || KANBAN_COLUMNS[0];
}
