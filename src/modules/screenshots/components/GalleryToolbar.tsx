import React from 'react';
import type { GalleryLayoutMode, ScreenshotSortOrder } from '../lib/types/screenshot';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Add01Icon,
  FilterIcon,
  GridIcon,
  MenuIcon,
  Folder01Icon,
  Sorting01Icon,
  Time01Icon,
} from '@hugeicons/core-free-icons';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';

export interface ProjectOption {
  id: string;
  name: string;
}

interface GalleryToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedModule: string | null;
  onModuleChange: (mod: string | null) => void;
  availableModules: string[];
  layoutMode: GalleryLayoutMode;
  onLayoutModeChange: (mode: GalleryLayoutMode) => void;
  sortOrder: ScreenshotSortOrder;
  onSortOrderChange: (sort: ScreenshotSortOrder) => void;
  onOpenUploadModal: () => void;
  projects?: ProjectOption[];
  selectedProjectId?: string;
  onSelectProject?: (projId: string) => void;
  readOnly?: boolean;
}

export const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedModule,
  onModuleChange,
  availableModules,
  layoutMode,
  onLayoutModeChange,
  sortOrder,
  onSortOrderChange,
  onOpenUploadModal,
  projects = [],
  selectedProjectId = 'all',
  onSelectProject,
  readOnly = false,
}) => {
  const selectedProjectName =
    selectedProjectId === 'all'
      ? 'All Projects'
      : projects.find((p) => p.id === selectedProjectId)?.name || 'Select Project';

  return (
    <div className="p-3 rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 backdrop-blur-md flex flex-col gap-2.5 font-mono text-xs shadow-md select-none">
      {/* Top Row: Project Selector + Search Bar + Layout Mode + Actions */}
      <div className="flex items-center justify-between gap-2 w-full flex-wrap lg:flex-nowrap">
        {/* Left Group: Project Selector + Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          {!readOnly && onSelectProject && (
            <div className="shrink-0 w-36 sm:w-44">
              <Select value={selectedProjectId} onValueChange={(val) => onSelectProject(val as string)}>
                <SelectTrigger className="h-8 text-[11px] px-2.5 bg-zinc-900 border-zinc-800 font-mono text-zinc-200 hover:text-white flex items-center gap-1.5 rounded-md">
                  <HugeiconsIcon icon={Folder01Icon} size={13} className="text-zinc-400 shrink-0" />
                  <SelectValue placeholder="Select Project">{selectedProjectName}</SelectValue>
                </SelectTrigger>
                <SelectContent className="min-w-[160px] max-w-[260px]">
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="relative flex-1 min-w-[140px]">
            <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search screenshots..."
              className="w-full h-8 pl-8 pr-3 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 text-zinc-200 text-xs font-mono rounded-md outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Right Group: Module Filter + Sort Order + Layout Switch + Upload */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto pt-1 lg:pt-0">
          {/* Module Filter Dropdown */}
          {availableModules.length > 0 && (
            <div className="w-28 sm:w-32">
              <Select
                value={selectedModule || 'all_modules'}
                onValueChange={(val) => onModuleChange(val === 'all_modules' ? null : (val as string))}
              >
                <SelectTrigger className="h-8 text-[11px] px-2 bg-zinc-900 border-zinc-800 font-mono text-zinc-300">
                  <SelectValue placeholder="Module..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_modules">All Modules</SelectItem>
                  {availableModules.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sort Order */}
          <div className="w-28 sm:w-32">
            <Select value={sortOrder} onValueChange={(val) => onSortOrderChange(val as ScreenshotSortOrder)}>
              <SelectTrigger className="h-8 text-[11px] px-2 bg-zinc-900 border-zinc-800 font-mono text-zinc-300">
                <SelectValue placeholder="Sort..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taken_at_desc">Newest First</SelectItem>
                <SelectItem value="taken_at_asc">Oldest First</SelectItem>
                <SelectItem value="title">By Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Layout Mode Toggle */}
          <div className="flex items-center rounded-md bg-zinc-900 border border-zinc-800 p-0.5">
            <button
              type="button"
              onClick={() => onLayoutModeChange('grid')}
              className={`p-1 rounded transition-colors cursor-pointer ${
                layoutMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid View"
            >
              <HugeiconsIcon icon={GridIcon} size={14} />
            </button>
            <button
              type="button"
              onClick={() => onLayoutModeChange('timeline')}
              className={`p-1 rounded transition-colors cursor-pointer ${
                layoutMode === 'timeline' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Timeline View"
            >
              <HugeiconsIcon icon={Time01Icon} size={14} />
            </button>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="h-8 px-2.5 sm:px-3 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-colors cursor-pointer shadow-md shrink-0"
              title="Upload Progress"
            >
              <HugeiconsIcon icon={Add01Icon} size={14} />
              <span className="hidden sm:inline whitespace-nowrap">Upload Progress</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryToolbar;
