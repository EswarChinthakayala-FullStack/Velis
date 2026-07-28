import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

interface MilestoneFormFooterProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onDelete?: () => void;
}

export const MilestoneFormFooter: React.FC<MilestoneFormFooterProps> = ({
  isEditMode,
  isSubmitting,
  onCancel,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-800 font-mono select-none">
      <div>
        {isEditMode && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className="h-8 px-3 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
            <span>Delete</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-8 px-3 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-8 px-4 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RadialSpinner size={12} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
              <span>{isEditMode ? 'Save Milestone' : 'Create Milestone'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MilestoneFormFooter;
