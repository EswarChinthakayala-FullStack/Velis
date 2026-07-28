import React from 'react';
import type { MilestoneItem, MilestoneStatus } from '../lib/types/milestone';
import { MilestoneConnector } from './MilestoneConnector';
import { MilestoneCard } from './MilestoneCard';

interface MilestoneTimelineProps {
  milestones: MilestoneItem[];
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

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  readOnly = false,
  onUpdateStatus,
  onUpdateProgress,
  onEditMilestone,
  onDeleteMilestone,
}) => {
  return (
    <div className="space-y-4 font-mono">
      {milestones.map((milestone, idx) => {
        const isLast = idx === milestones.length - 1;
        const status = deriveStatus(milestone);

        return (
          <div key={milestone.id} className="flex items-start gap-4">
            <MilestoneConnector status={status} isLast={isLast} />

            <div className="flex-1 min-w-0 pb-2">
              <MilestoneCard
                milestone={milestone}
                readOnly={readOnly}
                onUpdateStatus={onUpdateStatus}
                onUpdateProgress={onUpdateProgress}
                onEditMilestone={onEditMilestone}
                onDeleteMilestone={onDeleteMilestone}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MilestoneTimeline;
