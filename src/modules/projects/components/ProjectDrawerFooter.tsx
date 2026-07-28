import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Tick02Icon } from '@hugeicons/core-free-icons';

interface ProjectDrawerFooterProps {
  mode: 'create' | 'edit';
  isSubmitting: boolean;
  onCancel: () => void;
  formId?: string;
}

export const ProjectDrawerFooter: React.FC<ProjectDrawerFooterProps> = ({
  mode,
  isSubmitting,
  onCancel,
  formId = 'project-drawer-form',
}) => {
  return (
    <div className="px-6 py-4 border-t border-zinc-800 bg-[#0E0E10] flex items-center justify-end gap-2.5 shrink-0 select-none">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs font-medium disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        form={formId}
        disabled={isSubmitting}
        className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg transition-colors cursor-pointer text-xs disabled:opacity-50 shadow-lg"
      >
        <HugeiconsIcon icon={mode === 'create' ? PlusSignIcon : Tick02Icon} size={15} />
        <span>
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
            ? 'Create Project'
            : 'Save Changes'}
        </span>
      </button>
    </div>
  );
};

export default ProjectDrawerFooter;
