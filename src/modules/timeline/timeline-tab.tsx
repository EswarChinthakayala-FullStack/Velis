import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectTimeline } from './hooks/useProjectTimeline';
import { useTimelineFilters } from './hooks/useTimelineFilters';
import { useDeleteTimelineEntry } from './hooks/useDeleteTimelineEntry';
import { groupTimelineEntriesByDate } from './lib/utils/timeline-grouping';

import { TimelineHeader } from './components/TimelineHeader';
import { TimelineSearch } from './components/TimelineSearch';
import { TimelineFilters } from './components/TimelineFilters';
import { TimelineDateGroup } from './components/TimelineDateGroup';
import { TimelineEmptyState } from './components/TimelineEmptyState';
import { TimelineSkeleton } from './components/TimelineSkeleton';
import { CreateTimelineEntryModal } from './components/CreateTimelineEntryModal';

interface TimelineTabProps {
  projectId?: string;
  isReadOnly?: boolean;
  className?: string;
  projectSelector?: React.ReactNode;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  projectId,
  isReadOnly = false,
  className = '',
  projectSelector,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: entries, isLoading, isError, error } = useProjectTimeline(projectId);
  const deleteMutation = useDeleteTimelineEntry(projectId);

  // Filter & Search Logic
  const {
    filters,
    setSearch,
    setUpdateType,
    setVisibility,
    filteredEntries,
  } = useTimelineFilters(entries || []);

  // Group chronologically by date (Today, Yesterday, This Week, Month...)
  const dateGroups = groupTimelineEntriesByDate(filteredEntries);

  const handleDeleteEntry = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      // Handled in mutation
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-full max-w-[1400px] mx-auto space-y-6 select-none text-zinc-100 pb-16 ${className}`}
    >
      {/* Header */}
      <TimelineHeader
        totalCount={filteredEntries.length}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isReadOnly={isReadOnly}
        projectSelector={projectSelector}
      />

      {/* Search & Filters Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <TimelineSearch value={filters.search} onChange={setSearch} />
        </div>
        <div>
          <TimelineFilters
            selectedType={filters.updateType}
            onSelectType={setUpdateType}
            selectedVisibility={filters.visibility}
            onSelectVisibility={setVisibility}
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <TimelineSkeleton />
      ) : isError ? (
        <div className="p-8 rounded-2xl bg-rose-950/30 border border-rose-800/80 text-rose-300 font-mono text-xs text-center space-y-2">
          <p className="font-bold text-sm">Failed to load timeline updates</p>
          <p className="text-zinc-400 text-xs">{(error as Error)?.message || 'Database error occurred.'}</p>
        </div>
      ) : dateGroups.length === 0 ? (
        <TimelineEmptyState
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          isReadOnly={isReadOnly}
        />
      ) : (
        /* Chronological Date Groups Feed */
        <div className="space-y-8 pt-2">
          <AnimatePresence>
            {dateGroups.map((group) => (
              <TimelineDateGroup
                key={group.groupLabel}
                groupLabel={group.groupLabel}
                entries={group.entries}
                onDeleteEntry={handleDeleteEntry}
                deletingId={deletingId}
                isReadOnly={isReadOnly}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Update Modal */}
      {projectId && (
        <CreateTimelineEntryModal
          projectId={projectId}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default TimelineTab;
