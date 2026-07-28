import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ShieldKeyIcon,
  Add01Icon,
  Search01Icon,
  FilterIcon,
  PinIcon,
  ArchiveIcon,
  NoteIcon,
} from '@hugeicons/core-free-icons';

export interface OptionItem {
  id: string;
  name: string;
}

interface NotesHeaderProps {
  totalNotes: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  viewState: 'active' | 'pinned' | 'archived';
  onViewStateChange: (st: 'active' | 'pinned' | 'archived') => void;
  onOpenCreateModal: () => void;
  projects?: OptionItem[];
  selectedProjectId?: string;
  onSelectProject?: (pId: string) => void;
}

export const NotesHeader: React.FC<NotesHeaderProps> = ({
  totalNotes,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewState,
  onViewStateChange,
  onOpenCreateModal,
  projects = [],
  selectedProjectId = 'all',
  onSelectProject,
}) => {
  return (
    <div className="space-y-3 font-mono select-none">
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
            <HugeiconsIcon icon={ShieldKeyIcon} size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white font-sans tracking-tight">Private Admin Notes</h2>
              <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                {totalNotes} {totalNotes === 1 ? 'Note' : 'Notes'}
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-mono">
                Admin Only • Never Exposed to Clients
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-sans">
              Internal second brain for meeting notes, credentials references, architecture, and reminders.
            </p>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Project Selector (if multi-project) */}
          {projects.length > 0 && onSelectProject && (() => {
            const activeProject = projects.find((p) => p.id === selectedProjectId);
            const displayProjectName = selectedProjectId === 'all'
              ? 'All Projects'
              : activeProject
              ? activeProject.name
              : 'Project Workspace';

            return (
              <div className="flex-1 sm:w-44 min-w-0">
                <Select value={selectedProjectId} onValueChange={(val: any) => onSelectProject(String(val))}>
                  <SelectTrigger className="h-9 text-xs bg-[#0c0c0e] border-zinc-800 rounded-lg">
                    <SelectValue placeholder="All Projects">
                      {displayProjectName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-xs">
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })()}

          {/* New Note Action Button */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="h-9 px-3 sm:px-3.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0"
          >
            <HugeiconsIcon icon={Add01Icon} size={15} />
            <span className="hidden sm:inline">New Private Note</span>
            <span className="sm:hidden">New Note</span>
          </button>
        </div>
      </div>

      {/* Toolbar (Search + View State Tabs + Category Filter) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            className="absolute left-3 top-2.5 text-zinc-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes by title, content, or tags..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#0c0c0e] border border-zinc-800 focus:border-zinc-600 text-white text-xs placeholder-zinc-500 font-mono outline-none transition-colors"
          />
        </div>

        {/* View State Switcher & Category Filter - Shared horizontal row on mobile */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* View Tabs */}
          <div className="flex-1 sm:flex-initial flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => onViewStateChange('active')}
              className={`h-7 px-2 sm:px-2.5 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center gap-1 flex-1 sm:flex-initial ${
                viewState === 'active' ? 'bg-zinc-800 text-white font-medium shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <HugeiconsIcon icon={NoteIcon} size={12} />
              <span>All</span>
            </button>
            <button
              type="button"
              onClick={() => onViewStateChange('pinned')}
              className={`h-7 px-2 sm:px-2.5 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center gap-1 flex-1 sm:flex-initial ${
                viewState === 'pinned' ? 'bg-zinc-800 text-white font-medium shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <HugeiconsIcon icon={PinIcon} size={12} />
              <span>Pinned</span>
            </button>
            <button
              type="button"
              onClick={() => onViewStateChange('archived')}
              className={`h-7 px-2 sm:px-2.5 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center gap-1 flex-1 sm:flex-initial ${
                viewState === 'archived' ? 'bg-zinc-800 text-white font-medium shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <HugeiconsIcon icon={ArchiveIcon} size={12} />
              <span>Archived</span>
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex-1 sm:w-36 min-w-0">
            <Select value={selectedCategory} onValueChange={(val: any) => onCategoryChange(String(val))}>
              <SelectTrigger className="h-9 text-xs bg-[#0c0c0e] border-zinc-800 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <HugeiconsIcon icon={FilterIcon} size={12} className="text-zinc-500 shrink-0" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-xs font-mono">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="meeting">Meeting Notes</SelectItem>
                <SelectItem value="client_pref">Client Preferences</SelectItem>
                <SelectItem value="ideas">Ideas</SelectItem>
                <SelectItem value="bugs">Bugs</SelectItem>
                <SelectItem value="improvements">Improvements</SelectItem>
                <SelectItem value="architecture">Architecture</SelectItem>
                <SelectItem value="deployment">Deployment</SelectItem>
                <SelectItem value="credentials">Credentials Reference</SelectItem>
                <SelectItem value="followup">Follow Ups</SelectItem>
                <SelectItem value="internal_tasks">Internal Tasks</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
