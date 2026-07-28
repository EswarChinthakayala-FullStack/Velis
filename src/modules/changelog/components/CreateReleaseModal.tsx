import React from 'react';
import type { ChangelogEntry } from '../types/changelog';
import { ChangelogForm } from '../changelog-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Tag01Icon } from '@hugeicons/core-free-icons';

interface CreateReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  entryToEdit?: ChangelogEntry | null;
}

export const CreateReleaseModal: React.FC<CreateReleaseModalProps> = ({
  isOpen,
  onClose,
  projectId,
  entryToEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-2xl rounded-lg bg-[#0c0c0e]/95 border border-zinc-800 p-5 font-mono text-xs space-y-4 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <HugeiconsIcon icon={Tag01Icon} size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans tracking-tight">
                {entryToEdit ? 'Edit Release Version' : 'Create New Release Version'}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                Publish official version history, notes, and release artifacts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>

        {/* Release Composer Form */}
        <ChangelogForm
          projectId={projectId}
          entryToEdit={entryToEdit}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
