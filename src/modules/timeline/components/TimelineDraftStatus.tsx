import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, CloudUploadIcon, AlertCircleIcon } from '@hugeicons/core-free-icons';
import type { DraftStatus } from '../hooks/useTimelineDraft';

interface TimelineDraftStatusProps {
  status: DraftStatus;
}

export const TimelineDraftStatus: React.FC<TimelineDraftStatusProps> = ({ status }) => {
  return (
    <AnimatePresence mode="wait">
      {status === 'saved' && (
        <motion.span
          key="saved"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0"
        >
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} />
          <span>Draft Saved</span>
        </motion.span>
      )}

      {status === 'saving' && (
        <motion.span
          key="saving"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0"
        >
          <HugeiconsIcon icon={CloudUploadIcon} size={11} className="animate-bounce" />
          <span>Saving...</span>
        </motion.span>
      )}

      {status === 'unsaved' && (
        <motion.span
          key="unsaved"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="px-2 py-0.5 rounded-sm bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0"
        >
          <HugeiconsIcon icon={AlertCircleIcon} size={11} />
          <span>Unsaved Changes</span>
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default TimelineDraftStatus;
