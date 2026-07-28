import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MilestoneItem, MilestoneStatus } from '../lib/types/milestone';
import { MilestoneStatusBadge } from './MilestoneStatusBadge';
import { MilestoneNotes } from './MilestoneNotes';
import { MilestoneAttachments } from './MilestoneAttachments';
import { TaskProgressSlider } from '../../tasks/components/TaskProgressSlider';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  CheckmarkCircle02Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  AttachmentIcon,
  Edit01Icon,
  Delete02Icon,
} from '@hugeicons/core-free-icons';
import { formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';

import { ConfirmDeleteDialog } from '../../../components/ui/confirm-delete-dialog';

interface MilestoneCardProps {
  milestone: MilestoneItem;
  readOnly?: boolean;
  onUpdateStatus?: (id: string, status: MilestoneStatus) => void;
  onUpdateProgress?: (id: string, progress: number) => void;
  onEditMilestone?: (milestone: MilestoneItem) => void;
  onDeleteMilestone?: (id: string) => void;
}

function deriveStatus(milestone: MilestoneItem): MilestoneStatus {
  if (milestone.progress === 100 || milestone.completionDate) return 'completed';
  if (milestone.notes?.includes('[BLOCKED]')) return 'blocked';
  if (milestone.progress > 0) return 'in_progress';
  return 'planned';
}

function formatRelativeDueDate(dueDate?: string): string {
  if (!dueDate) return 'No due date';
  try {
    return formatDistanceToNow(parseISO(dueDate), { addSuffix: true });
  } catch {
    return dueDate;
  }
}

function calculateDurationDays(createdAt: string, completionDate?: string): number | null {
  try {
    const start = parseISO(createdAt);
    const end = completionDate ? parseISO(completionDate) : new Date();
    return Math.max(1, differenceInDays(end, start));
  } catch {
    return null;
  }
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  readOnly = false,
  onUpdateStatus,
  onUpdateProgress,
  onEditMilestone,
  onDeleteMilestone,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const status = deriveStatus(milestone);
  const attachmentCount = milestone.attachments?.length || 0;
  const durationDays = calculateDurationDays(milestone.createdAt, milestone.completionDate);

  return (
    <div
      className={`rounded-sm bg-[#0c0c0e]/90 border font-mono select-none transition-all shadow-lg ${
        status === 'completed'
          ? 'border-emerald-500/30'
          : status === 'in_progress'
          ? 'border-amber-500/30 ring-1 ring-amber-500/10'
          : status === 'blocked'
          ? 'border-rose-500/30'
          : 'border-zinc-800/90 hover:border-zinc-700'
      }`}
    >
      {/* Main Header Bar */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <MilestoneStatusBadge
                status={status}
                onChangeStatus={
                  readOnly || !onUpdateStatus
                    ? undefined
                    : (newStatus) => onUpdateStatus(milestone.id, newStatus)
                }
                disabled={readOnly}
              />

              {milestone.dueDate && (
                <span className="text-[10px] text-zinc-400 flex items-center gap-1" title={`Due: ${milestone.dueDate}`}>
                  <HugeiconsIcon icon={Calendar01Icon} size={11} />
                  <span>Due {formatRelativeDueDate(milestone.dueDate)}</span>
                </span>
              )}

              {milestone.completionDate && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1" title={`Completed: ${milestone.completionDate}`}>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} />
                  <span>Completed {milestone.completionDate}</span>
                </span>
              )}

              {durationDays && (
                <span className="text-[10px] text-zinc-500">
                  • {durationDays} day(s)
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
              {milestone.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!readOnly && onEditMilestone && (
              <button
                type="button"
                onClick={() => onEditMilestone(milestone)}
                className="p-1 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                title="Edit Milestone"
              >
                <HugeiconsIcon icon={Edit01Icon} size={14} />
              </button>
            )}

            {!readOnly && onDeleteMilestone && (
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="p-1 rounded-sm text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
                title="Delete Milestone"
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse Details' : 'Expand Details'}
            >
              <HugeiconsIcon icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon} size={14} />
            </button>
          </div>
        </div>

        {/* Progress Slider */}
        <TaskProgressSlider
          progress={milestone.progress}
          onChangeProgress={
            readOnly || !onUpdateProgress
              ? undefined
              : (progress) => onUpdateProgress(milestone.id, progress)
          }
          disabled={readOnly}
        />

        {/* Card Footer Snapshot */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
          <span>Sort Order #{milestone.sortOrder}</span>
          {attachmentCount > 0 && (
            <span className="flex items-center gap-1 text-zinc-400">
              <HugeiconsIcon icon={AttachmentIcon} size={12} />
              <span>{attachmentCount} asset(s)</span>
            </span>
          )}
        </div>
      </div>

      {/* Expandable Details Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-zinc-800/80 p-4 space-y-4 bg-zinc-950/60"
          >
            {/* Notes */}
            <MilestoneNotes notes={milestone.notes} />

            {/* Attachments */}
            <MilestoneAttachments
              milestoneId={milestone.id}
              attachments={milestone.attachments}
              readOnly={readOnly}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          if (onDeleteMilestone) {
            onDeleteMilestone(milestone.id);
          }
        }}
        title="Delete Milestone"
        description={`Are you sure you want to delete milestone "${milestone.name}"? This action cannot be undone.`}
        confirmText="Delete Milestone"
      />
    </div>
  );
};

export default MilestoneCard;
