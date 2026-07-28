import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Flag01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface MilestoneEmptyStateProps {
  readOnly?: boolean;
  onOpenCreateModal?: () => void;
}

export const MilestoneEmptyState: React.FC<MilestoneEmptyStateProps> = ({
  readOnly = false,
  onOpenCreateModal,
}) => {
  return (
    <div className="p-12 rounded-sm border border-dashed border-zinc-800 text-center font-mono select-none space-y-4 my-4 bg-zinc-950/40">
      <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
        <HugeiconsIcon icon={Flag01Icon} size={24} />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-sm font-bold text-white">No milestones created yet</h3>
        <p className="text-xs text-zinc-400">
          Create key project deliverable roadmaps to track progress and share business milestones with clients.
        </p>
      </div>

      {!readOnly && onOpenCreateModal && (
        <button
          onClick={onOpenCreateModal}
          className="h-9 px-4 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span>Create First Milestone</span>
        </button>
      )}
    </div>
  );
};

export default MilestoneEmptyState;
