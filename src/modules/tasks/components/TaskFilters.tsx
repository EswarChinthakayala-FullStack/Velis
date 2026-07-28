import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import type { TaskFilterState, TaskPriority, TaskStatus } from '../lib/types/task';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { useProjects } from '../../../modules/projects/hooks/useProjects';
import { getPriorityConfig, getStatusConfig } from '../lib/utils/task-formatters';

interface TaskFiltersProps {
  filters: TaskFilterState;
  availableModules: string[];
  onSearchChange: (val: string) => void;
  onProjectChange: (val: string) => void;
  onModuleChange: (val: string) => void;
  onPriorityChange: (val: 'all' | TaskPriority) => void;
  onStatusChange: (val: 'all' | TaskStatus) => void;
  onResetFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  availableModules,
  onSearchChange,
  onProjectChange,
  onModuleChange,
  onPriorityChange,
  onStatusChange,
  onResetFilters,
}) => {
  const { data: projectsData } = useProjects();
  const projects = projectsData?.projects || [];

  const isFiltered =
    filters.search ||
    filters.projectId !== 'all' ||
    filters.module !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.dueDate !== 'all';

  const selectedProjectName =
    filters.projectId === 'all'
      ? 'All Projects'
      : projects.find((p: any) => p.id === filters.projectId)?.name || 'All Projects';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 font-mono text-xs select-none">
      {/* 1. Global Search Input */}
      <div className="relative flex-1 min-w-[180px]">
        <HugeiconsIcon
          icon={Search01Icon}
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter tasks by title, module... (Press '/' to focus)"
          className="w-full h-9 pl-9 pr-3 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-500 outline-none focus:border-zinc-700 transition-colors"
        />
      </div>

      {/* 2. Responsive Filter Bar (3-column grid on mobile, flex on desktop) */}
      <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full md:w-auto">
        {/* Project Selector */}
        <Select value={filters.projectId} onValueChange={(val: any) => onProjectChange(String(val))}>
          <SelectTrigger className="h-9 px-2 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-zinc-200 hover:border-zinc-700 w-full sm:w-[130px] shrink-0">
            <SelectValue>{selectedProjectName}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
            <SelectItem value="all" className="font-mono text-xs rounded-sm">
              All Projects
            </SelectItem>
            {projects.map((p: any) => (
              <SelectItem key={p.id} value={p.id} className="font-mono text-xs rounded-sm">
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Selector */}
        <Select value={filters.priority} onValueChange={(val: any) => onPriorityChange(val as any)}>
          <SelectTrigger className="h-9 px-2 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-zinc-200 hover:border-zinc-700 w-full sm:w-[120px] shrink-0">
            <SelectValue>
              {filters.priority === 'all'
                ? 'All Priorities'
                : getPriorityConfig(filters.priority as TaskPriority).label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
            <SelectItem value="all" className="font-mono text-xs rounded-sm">All Priorities</SelectItem>
            <SelectItem value="urgent" className="font-mono text-xs rounded-sm">Critical</SelectItem>
            <SelectItem value="high" className="font-mono text-xs rounded-sm">High</SelectItem>
            <SelectItem value="medium" className="font-mono text-xs rounded-sm">Medium</SelectItem>
            <SelectItem value="low" className="font-mono text-xs rounded-sm">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Selector */}
        <Select value={filters.status} onValueChange={(val: any) => onStatusChange(val as any)}>
          <SelectTrigger className="h-9 px-2 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-zinc-200 hover:border-zinc-700 w-full sm:w-[120px] shrink-0">
            <SelectValue>
              {filters.status === 'all'
                ? 'All Statuses'
                : getStatusConfig(filters.status as TaskStatus).label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
            <SelectItem value="all" className="font-mono text-xs rounded-sm">All Statuses</SelectItem>
            <SelectItem value="todo" className="font-mono text-xs rounded-sm">Todo</SelectItem>
            <SelectItem value="in_progress" className="font-mono text-xs rounded-sm">In Progress</SelectItem>
            <SelectItem value="review" className="font-mono text-xs rounded-sm">In Review</SelectItem>
            <SelectItem value="testing" className="font-mono text-xs rounded-sm">Testing</SelectItem>
            <SelectItem value="completed" className="font-mono text-xs rounded-sm">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filter CTA */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="col-span-3 sm:col-auto h-9 px-2.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
            title="Reset active filters"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
