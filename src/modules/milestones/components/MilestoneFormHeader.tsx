import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Flag01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface MilestoneFormHeaderProps {
  isEditMode: boolean;
  onClose?: () => void;
}

export const MilestoneFormHeader: React.FC<MilestoneFormHeaderProps> = ({
  isEditMode,
  onClose,
}) => {
  return (
    <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono select-none">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
          <HugeiconsIcon icon={Flag01Icon} size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            {isEditMode ? 'Edit Milestone Deliverable' : 'Create Milestone Deliverable'}
          </h2>
          <p className="text-[11px] text-zinc-400">
            Define a high-level business checkpoint visible to team and client.
          </p>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          title="Close Form"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </button>
      )}
    </div>
  );
};

export default MilestoneFormHeader;
