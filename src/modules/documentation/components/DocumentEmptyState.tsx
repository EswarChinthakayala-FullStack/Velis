import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileCodeIcon, Add01Icon } from '@hugeicons/core-free-icons';

interface DocumentEmptyStateProps {
  readOnly?: boolean;
  onCreateDocument?: () => void;
}

export const DocumentEmptyState: React.FC<DocumentEmptyStateProps> = ({
  readOnly = false,
  onCreateDocument,
}) => {
  return (
    <div className="p-12 rounded-lg bg-[#0c0c0e]/80 border border-zinc-800/80 text-center font-mono space-y-4 my-6 shadow-xl select-none">
      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
        <HugeiconsIcon icon={FileCodeIcon} size={24} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white tracking-tight">No documentation available</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
          {readOnly
            ? 'No approved project documentation has been published yet.'
            : 'Create your first document to begin documenting your project specs, architecture, and deployment setup.'}
        </p>
      </div>

      {!readOnly && onCreateDocument && (
        <button
          type="button"
          onClick={onCreateDocument}
          className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs font-mono inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span>Create First Document</span>
        </button>
      )}
    </div>
  );
};

export default DocumentEmptyState;
