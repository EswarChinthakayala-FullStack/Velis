import React from 'react';
import type { FileCategory, FileViewMode, FileSortField, SortOrder } from '../lib/types/file';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Add01Icon,
  FilterIcon,
  GridIcon,
  MenuIcon,
  FolderAddIcon,
  Sorting01Icon,
  Folder01Icon,
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

interface FileToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: FileCategory;
  onCategoryChange: (cat: FileCategory) => void;
  viewMode: FileViewMode;
  onViewModeChange: (mode: FileViewMode) => void;
  sortField: FileSortField;
  onSortFieldChange: (field: FileSortField) => void;
  sortOrder: SortOrder;
  onSortOrderToggle: () => void;
  onOpenUploadModal: () => void;
  onOpenCreateFolderModal: () => void;
  projects?: ProjectOption[];
  selectedProjectId?: string;
  onSelectProject?: (projId: string) => void;
  readOnly?: boolean;
}

const CATEGORIES: { id: FileCategory; label: string }[] = [
  { id: 'all', label: 'All Files' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
  { id: 'pdf', label: 'PDFs' },
  { id: 'document', label: 'Docs' },
  { id: 'code', label: 'Code' },
  { id: 'archive', label: 'Archives' },
];

export const FileToolbar: React.FC<FileToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderToggle,
  onOpenUploadModal,
  onOpenCreateFolderModal,
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
      {/* Top Row: Project Selector + Search Bar + View Mode + Action Buttons */}
      <div className="flex items-center justify-between gap-2 w-full flex-wrap lg:flex-nowrap">
        {/* Left Group: Project Selector + Search Input */}
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
              placeholder="Search files & folders..."
              className="w-full h-8 pl-8 pr-3 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 text-zinc-200 text-xs font-mono rounded-md outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Right Group: Sort + View Mode + Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto pt-1 lg:pt-0">
          {/* Sort Field Selector */}
          <div className="w-28 sm:w-32">
            <Select value={sortField} onValueChange={(val) => onSortFieldChange(val as FileSortField)}>
              <SelectTrigger className="h-8 text-[11px] px-2 bg-zinc-900 border-zinc-800 font-mono text-zinc-300">
                <SelectValue placeholder="Sort..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="updated_at">Sort by Date</SelectItem>
                <SelectItem value="size">Sort by Size</SelectItem>
                <SelectItem value="mime_type">Sort by Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={onSortOrderToggle}
            className="h-8 px-2 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <HugeiconsIcon icon={Sorting01Icon} size={14} className={sortOrder === 'desc' ? 'rotate-180 transition-transform' : ''} />
          </button>

          {/* View Mode Toggle (Grid vs List) */}
          <div className="flex items-center rounded-md bg-zinc-900 border border-zinc-800 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1 rounded transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid View"
            >
              <HugeiconsIcon icon={GridIcon} size={14} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1 rounded transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="List View"
            >
              <HugeiconsIcon icon={MenuIcon} size={14} />
            </button>
          </div>

          {!readOnly && (
            <>
              <button
                type="button"
                onClick={onOpenCreateFolderModal}
                className="h-8 px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Create Folder"
              >
                <HugeiconsIcon icon={FolderAddIcon} size={13} />
                <span className="hidden sm:inline">Folder</span>
              </button>

              <button
                type="button"
                onClick={onOpenUploadModal}
                className="h-8 px-2.5 sm:px-3 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-colors cursor-pointer shadow-md shrink-0"
                title="Upload Files"
              >
                <HugeiconsIcon icon={Add01Icon} size={14} />
                <span className="hidden sm:inline whitespace-nowrap">Upload</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Row: Category Filter Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5 w-full border-t border-zinc-800/40 pt-2">
        <HugeiconsIcon icon={FilterIcon} size={13} className="text-zinc-500 shrink-0 ml-0.5" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileToolbar;
