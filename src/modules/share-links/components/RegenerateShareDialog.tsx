import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon, Cancel01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons';
import type { ShareLinkItem } from '../lib/types/share-link';
import { formatShareUrl, shortenShareUrl } from '../lib/utils/share-link';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

interface RegenerateShareDialogProps {
  isOpen: boolean;
  link: ShareLinkItem | null;
  onClose: () => void;
  onConfirm: (linkId: string) => void;
  isLoading?: boolean;
}

export const RegenerateShareDialog: React.FC<RegenerateShareDialogProps> = ({
  isOpen,
  link,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen || !link) return null;

  const url = formatShareUrl(link.token);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <HugeiconsIcon icon={RefreshIcon} size={15} />
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Regenerate Share Token</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          {/* Warning Banner */}
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 flex items-start gap-2.5">
            <div className="text-red-400 mt-0.5 shrink-0">
              <HugeiconsIcon icon={AlertCircleIcon} size={16} />
            </div>
            <p className="text-xs text-red-200/90 leading-normal">
              <strong className="text-red-300">Warning:</strong> The current link URL will become immediately invalid. Anyone using the old URL will lose access.
            </p>
          </div>

          {/* Current URL preview */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Current Link URL</span>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-400 truncate">
              {shortenShareUrl(url, 48)}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-300 text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                onConfirm(link.id);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-xs hover:bg-red-500 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-red-950/40"
            >
              {isLoading ? (
                <>
                  <RadialSpinner size={14} className="text-white" />
                  <span>Regenerating...</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={RefreshIcon} size={14} />
                  <span>Regenerate Token</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
