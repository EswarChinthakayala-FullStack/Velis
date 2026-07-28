import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  useMilestones,
  useUpdateMilestone,
  useDeleteMilestone,
} from '../../lib/supabase/queries/milestones';
import type { MilestoneItem, MilestoneStatus, MilestoneSummaryStats } from './lib/types/milestone';
import { MilestoneHeader } from './components/MilestoneHeader';
import { MilestoneSummary } from './components/MilestoneSummary';
import { MilestoneTimeline } from './components/MilestoneTimeline';
import { MilestoneEmptyState } from './components/MilestoneEmptyState';
import { MilestoneSkeleton } from './components/MilestoneSkeleton';
import { CreateMilestoneModal } from './components/CreateMilestoneModal';

interface MilestonesTabProps {
  projectId?: string;
  readOnly?: boolean;
  className?: string;
}

export const MilestonesTab: React.FC<MilestonesTabProps> = ({
  projectId,
  readOnly = false,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [milestoneToEdit, setMilestoneToEdit] = useState<MilestoneItem | null>(null);

  // 1. Fetch live Supabase milestones data
  const { data: milestones = [], isLoading } = useMilestones(projectId);

  // 2. Mutations
  const updateMutation = useUpdateMilestone(projectId);
  const deleteMutation = useDeleteMilestone(projectId);

  // 3. Compute Summary Statistics
  const summaryStats = useMemo<MilestoneSummaryStats>(() => {
    const total = milestones.length;
    if (total === 0) {
      return { total: 0, completed: 0, inProgress: 0, planned: 0, overallProgress: 0 };
    }

    const completed = milestones.filter((m) => m.progress === 100 || m.completionDate).length;
    const inProgress = milestones.filter((m) => m.progress > 0 && m.progress < 100).length;
    const planned = milestones.filter((m) => m.progress === 0 && !m.completionDate).length;
    const totalProgressSum = milestones.reduce((sum, m) => sum + m.progress, 0);
    const overallProgress = Math.round(totalProgressSum / total);

    return {
      total,
      completed,
      inProgress,
      planned,
      overallProgress,
    };
  }, [milestones]);

  // Handlers for Inline Updates
  const handleUpdateStatus = (id: string, status: MilestoneStatus) => {
    if (readOnly) return;
    const target = milestones.find((m) => m.id === id);
    if (!target) return;

    let progress = target.progress;
    let completionDate: string | null = target.completionDate || null;
    let notes = target.notes || '';

    if (status === 'completed') {
      progress = 100;
      completionDate = new Date().toISOString().split('T')[0];
      notes = notes.replace(/^\[BLOCKED\]\s*/i, '').trim();
    } else if (status === 'in_progress') {
      progress = progress === 100 || progress === 0 ? 50 : progress;
      completionDate = null;
      notes = notes.replace(/^\[BLOCKED\]\s*/i, '').trim();
    } else if (status === 'blocked') {
      progress = progress === 100 ? 50 : progress;
      completionDate = null;
      if (!notes.toUpperCase().includes('[BLOCKED]')) {
        notes = notes ? `[BLOCKED] ${notes}` : '[BLOCKED]';
      }
    } else if (status === 'planned') {
      progress = 0;
      completionDate = null;
      notes = notes.replace(/^\[BLOCKED\]\s*/i, '').trim();
    }

    updateMutation.mutate({
      id,
      payload: {
        progress,
        completionDate,
        notes,
      },
    });
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    if (readOnly) return;
    updateMutation.mutate({ id, payload: { progress } });
  };

  const handleDeleteMilestone = (id: string) => {
    if (readOnly) return;
    deleteMutation.mutate(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`space-y-6 text-zinc-100 font-mono ${className}`}
    >
      {/* 1. Milestone Header */}
      <MilestoneHeader
        totalMilestones={milestones.length}
        readOnly={readOnly}
        onOpenCreateModal={() => {
          setMilestoneToEdit(null);
          setIsModalOpen(true);
        }}
      />

      {/* 2. Summary KPI Cards */}
      <MilestoneSummary stats={summaryStats} />

      {/* 3. Main Timeline Viewport */}
      {isLoading ? (
        <MilestoneSkeleton />
      ) : milestones.length === 0 ? (
        <MilestoneEmptyState
          readOnly={readOnly}
          onOpenCreateModal={() => {
            setMilestoneToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <MilestoneTimeline
          milestones={milestones}
          readOnly={readOnly}
          onUpdateStatus={handleUpdateStatus}
          onUpdateProgress={handleUpdateProgress}
          onEditMilestone={(m) => {
            setMilestoneToEdit(m);
            setIsModalOpen(true);
          }}
          onDeleteMilestone={handleDeleteMilestone}
        />
      )}

      {/* Modal for Creating/Editing Milestones */}
      {!readOnly && (
        <CreateMilestoneModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setMilestoneToEdit(null);
          }}
          defaultProjectId={projectId}
          milestoneToEdit={milestoneToEdit}
        />
      )}
    </motion.div>
  );
};

export default MilestonesTab;
