import React from 'react';
import { ReleaseSearch } from './ReleaseSearch';
import { ReleaseFilters } from './ReleaseFilters';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Tag01Icon, Folder01Icon } from '@hugeicons/core-free-icons';

export interface ProjectOption {
  id: string;
  name: string;
}

interface ChangelogHeaderProps {
  totalReleases: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: string;
  onTypeChange: (t: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  onOpenCreateModal?: () => void;
  projects?: ProjectOption[];
  selectedProjectId?: string;
  onSelectProject?: (projId: string) => void;
  readOnly?: boolean;
}

export const ChangelogHeader: React.FC<ChangelogHeaderProps> = ({
  totalReleases,
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onOpenCreateModal,
  projects = [],
  selectedProjectId = 'all',
  onSelectProject,
  readOnly = false,
}) => {
  return (
    <div className="space-y-3 font-mono select-none">
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
            <HugeiconsIcon icon={Tag01Icon} size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-sans tracking-tight">Project Changelog</h2>
              <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                {totalReleases} {totalReleases === 1 ? 'Release' : 'Releases'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-sans">
              Official version history, release notes, features, and deployment artifacts.
            </p>
          </div>
        </div>

        {/* Action Controls Row for Mobile & Desktop */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Project Selector (if multi-project view) */}
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
                    <div className="flex items-center gap-1.5 truncate">
                      <HugeiconsIcon icon={Folder01Icon} size={12} className="text-zinc-500 shrink-0" />
                      <SelectValue placeholder="All Projects">
                        {displayProjectName}
                      </SelectValue>
                    </div>
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

          {/* Create Release Action Button */}
          {!readOnly && onOpenCreateModal && (
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="h-9 px-3 sm:px-3.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0"
              title="Create Release"
            >
              <HugeiconsIcon icon={Add01Icon} size={15} />
              <span className="hidden xs:inline sm:inline">Create Release</span>
              <span className="xs:hidden sm:hidden">Release</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar in 1 Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <ReleaseSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <ReleaseFilters
          selectedType={selectedType}
          onTypeChange={onTypeChange}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};
