import React from 'react';
import type { DocumentItem, DocumentCategory } from '../lib/types/documentation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Add01Icon,
  FilterIcon,
  Download01Icon,
  PrinterIcon,
  Edit01Icon,
  Delete02Icon,
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

interface DocumentationToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: DocumentCategory | 'all';
  onCategoryChange: (cat: DocumentCategory | 'all') => void;
  readOnly?: boolean;
  onOpenCreateModal?: () => void;
  onOpenEditModal?: () => void;
  onDeleteDocument?: () => void;
  onExportMarkdown?: () => void;
  documents?: DocumentItem[];
  selectedDocumentId?: string;
  onSelectDocument?: (doc: DocumentItem) => void;
  projects?: ProjectOption[];
  selectedProjectId?: string;
  onSelectProject?: (projectId: string) => void;
}

const CATEGORIES: (DocumentCategory | 'all')[] = [
  'all',
  'Technical',
  'API',
  'Deployment',
  'Database',
  'User Guide',
  'Internal',
  'Client Visible',
];

export const DocumentationToolbar: React.FC<DocumentationToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  readOnly = false,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteDocument,
  onExportMarkdown,
  documents = [],
  selectedDocumentId,
  onSelectDocument,
  projects = [],
  selectedProjectId = 'all',
  onSelectProject,
}) => {
  // Find selected document title for clean display
  const selectedDocTitle =
    documents.find((d) => d.id === selectedDocumentId)?.title || 'Select document...';

  // Find selected project name
  const selectedProjectName =
    selectedProjectId === 'all'
      ? 'All Projects'
      : projects.find((p) => p.id === selectedProjectId)?.name || 'Select Project';

  return (
    <div className="p-3 rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 backdrop-blur-md flex flex-col gap-2 font-mono text-xs shadow-md select-none">
      {/* Top Row: Project Selector + Search Bar + Mobile Document Selector + Action Buttons */}
      <div className="flex items-center justify-between gap-2 w-full flex-wrap lg:flex-nowrap">
        {/* Left Group: Project Selector + Search Input */}
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          {!readOnly && onSelectProject && (
            <div className="shrink-0 w-36 sm:w-44">
              <Select
                value={selectedProjectId}
                onValueChange={(val) => onSelectProject(val as string)}
              >
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
              placeholder="Search documentation..."
              className="w-full h-8 pl-8 pr-3 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 text-zinc-200 text-xs font-mono rounded-md outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Right Group: Mobile Doc Selector + Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto pt-1 lg:pt-0">
          {/* Mobile Document Index Selector (md:hidden) */}
          {documents.length > 0 && onSelectDocument && (
            <div className="md:hidden shrink-0 w-32 sm:w-40">
              <Select
                value={selectedDocumentId}
                onValueChange={(id) => {
                  const found = documents.find((d) => d.id === id);
                  if (found) onSelectDocument(found);
                }}
              >
                <SelectTrigger className="h-8 text-[11px] px-2 bg-zinc-900 border-zinc-800 font-mono text-zinc-200 rounded-md">
                  <SelectValue placeholder="Select doc...">{selectedDocTitle}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-w-[260px]">
                  {documents.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {onExportMarkdown && (
            <button
              type="button"
              onClick={onExportMarkdown}
              className="h-8 w-8 sm:w-auto sm:px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Export Markdown"
            >
              <HugeiconsIcon icon={Download01Icon} size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="h-8 w-8 sm:w-auto sm:px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Print Document"
          >
            <HugeiconsIcon icon={PrinterIcon} size={13} />
            <span className="hidden sm:inline">Print</span>
          </button>

          {!readOnly && onOpenEditModal && (
            <button
              type="button"
              onClick={onOpenEditModal}
              className="h-8 px-2.5 sm:px-3 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Edit Document"
            >
              <HugeiconsIcon icon={Edit01Icon} size={13} />
              <span>Edit</span>
            </button>
          )}

          {!readOnly && onDeleteDocument && (
            <button
              type="button"
              onClick={onDeleteDocument}
              className="h-8 px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-rose-900/60 text-rose-400 hover:text-rose-300 text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Delete Document"
            >
              <HugeiconsIcon icon={Delete02Icon} size={13} />
            </button>
          )}

          {!readOnly && onOpenCreateModal && (
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="h-8 px-2.5 sm:px-3 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-colors cursor-pointer shadow-md shrink-0"
              title="New Document"
            >
              <HugeiconsIcon icon={Add01Icon} size={14} />
              <span className="hidden sm:inline whitespace-nowrap">New Doc</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Category Filter Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5 w-full border-t border-zinc-800/40 pt-2">
        <HugeiconsIcon icon={FilterIcon} size={13} className="text-zinc-500 shrink-0 ml-0.5" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {cat === 'all' ? 'All Docs' : cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocumentationToolbar;
