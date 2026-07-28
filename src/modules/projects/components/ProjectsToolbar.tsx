import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, RefreshIcon, FilterIcon, Sorting01Icon } from '@hugeicons/core-free-icons';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import type { ProjectStatus, ProjectPriority } from '../../../types/project';

interface ProjectsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProjectStatus | 'all';
  onStatusFilterChange: (status: ProjectStatus | 'all') => void;
  priorityFilter: ProjectPriority | 'all';
  onPriorityFilterChange: (priority: ProjectPriority | 'all') => void;
  sortBy: 'created_at' | 'updated_at' | 'name' | 'deadline' | 'completion_percent';
  onSortByChange: (sort: 'created_at' | 'updated_at' | 'name' | 'deadline' | 'completion_percent') => void;
  onRefresh: () => void;
  onNewProject?: () => void;
  totalCount?: number;
}

export const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
  onRefresh,
  totalCount = 0,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none pb-3.5 border-b border-zinc-800/60">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by project name or description..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 outline-none transition-colors font-mono"
        />
      </div>

      {/* Toolbar Controls in a Single Aligned Row */}
      <div className="flex items-center gap-2 shrink-0 overflow-x-auto pt-1 sm:pt-0">
        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(val: any) => onStatusFilterChange(val as ProjectStatus | 'all')}
        >
          <SelectTrigger className="w-[130px] sm:w-[140px] h-9 font-mono">
            <div className="flex items-center gap-1.5 truncate">
              <HugeiconsIcon icon={FilterIcon} size={14} className="text-zinc-500 shrink-0" />
              <SelectValue placeholder="All Statuses" />
            </div>
          </SelectTrigger>
          <SelectContent align="end" className="bg-[#111113] border-zinc-800 font-mono">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={priorityFilter}
          onValueChange={(val: any) => onPriorityFilterChange(val as ProjectPriority | 'all')}
        >
          <SelectTrigger className="w-[120px] sm:w-[130px] h-9 font-mono">
            <div className="flex items-center gap-1.5 truncate">
              <HugeiconsIcon icon={FilterIcon} size={14} className="text-zinc-500 shrink-0" />
              <SelectValue placeholder="All Priority" />
            </div>
          </SelectTrigger>
          <SelectContent align="end" className="bg-[#111113] border-zinc-800 font-mono">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By Dropdown */}
        <Select
          value={sortBy}
          onValueChange={(val: any) => onSortByChange(val)}
        >
          <SelectTrigger className="w-[140px] sm:w-[150px] h-9 font-mono">
            <div className="flex items-center gap-1.5 truncate">
              <HugeiconsIcon icon={Sorting01Icon} size={14} className="text-zinc-500 shrink-0" />
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent align="end" className="bg-[#111113] border-zinc-800 font-mono">
            <SelectItem value="created_at">Recently Created</SelectItem>
            <SelectItem value="updated_at">Recently Updated</SelectItem>
            <SelectItem value="deadline">Nearest Deadline</SelectItem>
            <SelectItem value="completion_percent">Highest Progress</SelectItem>
            <SelectItem value="name">Project Name</SelectItem>
          </SelectContent>
        </Select>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
          title="Refresh Projects"
          aria-label="Refresh Projects"
        >
          <HugeiconsIcon icon={RefreshIcon} size={15} />
        </button>

        {/* Count Badge */}
        <span className="hidden md:inline-flex h-9 items-center px-3 text-[11px] font-mono rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 shrink-0 whitespace-nowrap">
          {totalCount} Projects
        </span>
      </div>
    </div>
  );
};

export default ProjectsToolbar;
