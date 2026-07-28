import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SaveState } from '../hooks/useAutosaveDocument';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, Loading02Icon, AlertCircleIcon } from '@hugeicons/core-free-icons';

interface MarkdownStatusProps {
  status: SaveState;
  lastSavedTime: Date | null;
}

export const MarkdownStatus: React.FC<MarkdownStatusProps> = ({ status, lastSavedTime }) => {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 select-none">
      <AnimatePresence mode="wait">
        {status === 'saving' && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            className="flex items-center gap-1.5 text-zinc-400"
          >
            <HugeiconsIcon icon={Loading02Icon} size={14} className="animate-spin text-zinc-400" />
            <span className="text-[11px]">Saving...</span>
          </motion.div>
        )}

        {status === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            className="flex items-center gap-1.5 text-emerald-400"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span className="text-[11px]">
              Saved {lastSavedTime ? `${Math.round((Date.now() - lastSavedTime.getTime()) / 1000)}s ago` : 'just now'}
            </span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            className="flex items-center gap-1.5 text-rose-400"
          >
            <HugeiconsIcon icon={AlertCircleIcon} size={14} />
            <span className="text-[11px]">Save failed</span>
          </motion.div>
        )}

        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-zinc-500"
          >
            <span className="text-[11px]">All changes saved</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarkdownStatus;
