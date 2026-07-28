import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon, AlertCircleIcon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface RepositoryValidationProps {
  isValidating: boolean;
  isValid: boolean | null;
  errorMessage?: string | null;
  normalizedUrl?: string | null;
}

export const RepositoryValidation: React.FC<RepositoryValidationProps> = ({
  isValidating,
  isValid,
  errorMessage,
  normalizedUrl,
}) => {
  if (!isValidating && isValid === null && !errorMessage) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1.5 font-mono text-xs"
    >
      {isValidating && (
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>Verifying URL & fetching repository metadata from GitHub...</span>
        </div>
      )}

      {!isValidating && isValid === true && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
            <HugeiconsIcon icon={Tick02Icon} size={14} />
            <span>GitHub Repository Validated & Connected</span>
          </div>
          {normalizedUrl && (
            <div className="text-[10px] text-zinc-500 truncate">
              Normalized: <span className="text-zinc-400">{normalizedUrl}</span>
            </div>
          )}
        </div>
      )}

      {!isValidating && isValid === false && (
        <div className="flex items-start gap-2 text-rose-400 text-[11px]">
          <HugeiconsIcon icon={Cancel01Icon} size={14} className="shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Validation Error</span>
            <p className="text-zinc-400 text-[10px] leading-tight">
              {errorMessage || 'Failed to validate repository. Ensure the URL format is correct and public.'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RepositoryValidation;
