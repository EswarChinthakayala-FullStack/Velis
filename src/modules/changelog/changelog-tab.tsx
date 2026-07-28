import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProjectChangelog, useDeleteChangelogEntry } from './lib/supabase/queries/changelog';
import { useProjects } from '../projects/hooks/useProjects';
import { useReleaseSearch } from './hooks/useReleaseSearch';

import { ChangelogHeader, type ProjectOption } from './components/ChangelogHeader';
import { ReleaseCard } from './components/ReleaseCard';
import { ReleaseEmptyState } from './components/ReleaseEmptyState';
import { ReleaseSkeleton } from './components/ReleaseSkeleton';
import { CreateReleaseModal } from './components/CreateReleaseModal';
import type { ChangelogEntry } from './types/changelog';

export interface ChangelogTabProps {
  projectId?: string;
  readOnly?: boolean;
  className?: string;
}

export const ChangelogTab: React.FC<ChangelogTabProps> = ({
  projectId,
  readOnly = false,
  className = '',
}) => {
  // Project selection state
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'all');
  const { data: projectsResult } = useProjects();

  const activeProjectId = projectId || (selectedProjectId === 'all' ? undefined : selectedProjectId);

  // Queries & Mutations
  const { data: entries = [], isLoading } = useProjectChangelog(activeProjectId);
  const deleteMutation = useDeleteChangelogEntry();

  // Search & Filter hook
  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    filteredEntries,
  } = useReleaseSearch(entries);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<ChangelogEntry | null>(null);

  const projectsOptions: ProjectOption[] = useMemo(() => {
    const rawProjects =
      (projectsResult as any)?.data ||
      (projectsResult as any)?.projects ||
      (Array.isArray(projectsResult) ? projectsResult : []);

    return rawProjects.map((p: any) => ({
      id: String(p.id),
      name: p.name || p.title || 'Untitled Project',
    }));
  }, [projectsResult]);

  const handleEditEntry = (entry: ChangelogEntry) => {
    setEntryToEdit(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`space-y-6 text-zinc-100 font-mono select-none ${className}`}
    >
      {/* 1. Header & Filters */}
      <ChangelogHeader
        totalReleases={filteredEntries.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onOpenCreateModal={() => {
          setEntryToEdit(null);
          setIsModalOpen(true);
        }}
        projects={readOnly || projectId ? [] : projectsOptions}
        selectedProjectId={projectId || selectedProjectId}
        onSelectProject={readOnly || projectId ? undefined : (projId) => setSelectedProjectId(projId)}
        readOnly={readOnly}
      />

      {/* 2. Release Cards Timeline Viewport */}
      {isLoading ? (
        <ReleaseSkeleton />
      ) : filteredEntries.length === 0 ? (
        <ReleaseEmptyState
          isSearchFiltered={searchQuery.trim().length > 0 || selectedType !== 'all' || selectedStatus !== 'all'}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedType('all');
            setSelectedStatus('all');
          }}
          onOpenCreateModal={() => {
            setEntryToEdit(null);
            setIsModalOpen(true);
          }}
          readOnly={readOnly}
        />
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <ReleaseCard
              key={entry.id}
              entry={entry}
              readOnly={readOnly}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          ))}
        </div>
      )}

      {/* 3. Create / Edit Release Modal */}
      {!readOnly && (
        <CreateReleaseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEntryToEdit(null);
          }}
          projectId={activeProjectId || projectsOptions[0]?.id || ''}
          entryToEdit={entryToEdit}
        />
      )}
    </motion.div>
  );
};

export default ChangelogTab;
