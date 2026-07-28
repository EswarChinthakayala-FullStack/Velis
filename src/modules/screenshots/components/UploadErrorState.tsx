import React from 'react';
import type { FileValidationError } from '../hooks/useUploadValidation';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface UploadErrorStateProps {
  errors: FileValidationError[];
  onClear: () => void;
}

export const UploadErrorState: React.FC<UploadErrorStateProps> = ({ errors, onClear }) => {
  if (errors.length === 0) return null;

  return (
    <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 font-mono text-xs text-rose-300 space-y-2 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <HugeiconsIcon icon={AlertCircleIcon} size={15} className="text-rose-400" />
          <span>File Validation Warnings ({errors.length})</span>
        </div>
        <button type="button" onClick={onClear} className="p-0.5 text-rose-400 hover:text-rose-200 cursor-pointer">
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      </div>

      <ul className="space-y-1 text-[11px] list-disc list-inside text-rose-300/90 max-h-32 overflow-y-auto custom-scrollbar">
        {errors.map((err, idx) => (
          <li key={idx}>
            <span className="font-semibold text-white">{err.fileName}:</span> {err.reason}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadErrorState;
