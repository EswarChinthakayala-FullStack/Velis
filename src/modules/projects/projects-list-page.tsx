import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from './hooks/useProjects';
import { ProjectsToolbar } from './components/ProjectsToolbar';
import { ProjectsGrid } from './components/ProjectsGrid';
import { ProjectsSkeleton } from './components/ProjectsSkeleton';
import { ProjectsEmptyState } from './components/ProjectsEmptyState';
import { ProjectFormDrawer } from './components/ProjectFormDrawer';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import type { ProjectStatus, ProjectPriority, ProjectItem } from '../../types/project';

/**
 * ProjectsListPage Component (PHASE 07)
 * Enterprise Project Directory Workspace for Velis.
 * 
 * Backed 100% by live Supabase queries via React Query v5.
 * Strictly production-only: ZERO mock data or fabricated project cards.
 */
export const ProjectsListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'name' | 'deadline' | 'completion_percent'>('created_at');
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | undefined>(undefined);

  // Fetch projects directory from Supabase
  const { data, isLoading, isError, refetch } = useProjects({
    search,
    status: statusFilter,
    priority: priorityFilter,
    page,
    pageSize: 12,
    sortBy,
    sortOrder: 'desc',
  });

  const projects = data?.projects || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const handleEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setIsDrawerOpen(true);
  };

  const handleNewProject = () => {
    setEditingProject(undefined);
    setIsDrawerOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full max-w-[1600px] mx-auto space-y-6 text-zinc-100 select-none"
    >
      {/* 1. Page Header */}
      <div className="flex flex-row items-center justify-between gap-3 pb-3 border-b border-zinc-800/60 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight truncate">Projects Directory</h1>
          <p className="text-xs text-zinc-400 font-normal truncate hidden sm:block mt-0.5">
            Manage and monitor all active and historical client contract deliverables from a single workspace.
          </p>
        </div>

        <button
          onClick={handleNewProject}
          className="h-9 w-9 p-0 sm:w-auto sm:px-4 flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-lg shrink-0 whitespace-nowrap"
          title="Create New Project"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>

      {/* 2. Toolbar */}
      <ProjectsToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={(val) => {
          setPriorityFilter(val);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        onRefresh={() => refetch()}
        onNewProject={handleNewProject}
        totalCount={totalCount}
      />

      {/* 3. Grid / Skeleton / Error / Empty States */}
      {isLoading && <ProjectsSkeleton />}

      {isError && (
        <div className="p-12 text-center border border-zinc-800/80 rounded-xl bg-[rgba(17,17,19,0.85)] space-y-3">
          <p className="text-xs text-zinc-400 font-mono">Unable to load project workspace.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            Retry Query
          </button>
        </div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <ProjectsEmptyState onNewProject={handleNewProject} />
      )}

      {!isLoading && !isError && projects.length > 0 && (
        <div className="space-y-6">
          <ProjectsGrid projects={projects} onEdit={handleEdit} />

          {/* 4. Server-Side Pagination Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-zinc-400 font-mono border-t border-zinc-800/60">
            <span>
              Showing {Math.min((page - 1) * 12 + 1, totalCount)}–{Math.min(page * 12, totalCount)} of {totalCount} Projects
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                <span>Previous</span>
              </button>

              <span className="px-2 font-bold text-white">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create / Edit Project Slide-Over Drawer */}
      <ProjectFormDrawer
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) setEditingProject(undefined);
        }}
        mode={editingProject ? 'edit' : 'create'}
        project={editingProject}
      />
    </motion.div>
  );
};

export default ProjectsListPage;
