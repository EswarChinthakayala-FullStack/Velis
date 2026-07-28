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
  RocketIcon,
  Add01Icon,
  Search01Icon,
  FilterIcon,
  Folder01Icon,
} from '@hugeicons/core-free-icons';

export interface ProjectOption {
  id: string;
  name: string;
}

interface DeploymentHeaderProps {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedEnv: string;
  onEnvChange: (env: string) => void;
  selectedHealth: string;
  onHealthChange: (h: string) => void;
  onOpenCreateModal?: () => void;
  projects?: ProjectOption[];
  selectedProjectId?: string;
  onSelectProject?: (pId: string) => void;
  readOnly?: boolean;
}

export const DeploymentHeader: React.FC<DeploymentHeaderProps> = ({
  totalCount,
  searchQuery,
  onSearchChange,
  selectedEnv,
  onEnvChange,
  selectedHealth,
  onHealthChange,
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
            <HugeiconsIcon icon={RocketIcon} size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-sans tracking-tight">Deployments & Environments</h2>
              <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                {totalCount} {totalCount === 1 ? 'Environment' : 'Environments'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-sans">
              Centralized management of live application URLs, health status, and deployment history.
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

          {/* Add Environment Action Button (Admin View Only) */}
          {!readOnly && onOpenCreateModal && (
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="h-9 px-3 sm:px-3.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0"
            >
              <HugeiconsIcon icon={Add01Icon} size={15} />
              <span className="hidden sm:inline">Add Environment</span>
              <span className="sm:hidden">Add Env</span>
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Search + Filter Dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
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
            placeholder="Search by environment, version, branch, or commit SHA..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#0c0c0e] border border-zinc-800 focus:border-zinc-600 text-white text-xs placeholder-zinc-500 font-mono outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-mono select-none">
          {/* Environment Filter */}
          <div className="flex-1 sm:w-36 min-w-0">
            <Select value={selectedEnv} onValueChange={(val: any) => onEnvChange(String(val))}>
              <SelectTrigger className="h-9 text-xs bg-[#0c0c0e] border-zinc-800 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <HugeiconsIcon icon={FilterIcon} size={12} className="text-zinc-500 shrink-0" />
                  <SelectValue placeholder="All Envs" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-xs">
                <SelectItem value="all">All Envs</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="qa">QA</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="preview">Preview</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Health Filter */}
          <div className="flex-1 sm:w-36 min-w-0">
            <Select value={selectedHealth} onValueChange={(val: any) => onHealthChange(String(val))}>
              <SelectTrigger className="h-9 text-xs bg-[#0c0c0e] border-zinc-800 rounded-lg">
                <SelectValue placeholder="All Health" />
              </SelectTrigger>
              <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-xs">
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Degraded</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
