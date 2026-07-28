import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon, Cancel01Icon } from '@hugeicons/core-free-icons';
import type { ShareLinkItem } from '../lib/types/share-link';
import { formatShareUrl, shortenShareUrl } from '../lib/utils/share-link';

interface DisableShareDialogProps {
  isOpen: boolean;
  link: ShareLinkItem | null;
  onClose: () => void;
  onConfirm: (linkId: string) => void;
  isLoading?: boolean;
}

export const DisableShareDialog: React.FC<DisableShareDialogProps> = ({
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-md rounded-lg bg-[#0c0c0e] border border-zinc-800 p-5 shadow-2xl space-y-4 font-sans text-zinc-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                <HugeiconsIcon icon={CancelCircleIcon} size={18} />
              </div>
              <h3 className="text-base font-semibold text-white">Disable Share Link</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          <p className="text-xs text-zinc-300">
            Are you sure you want to disable access to this share portal? Anyone trying to view the portal via this link will be denied access.
          </p>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-300 truncate">
            {shortenShareUrl(url, 48)}
          </div>

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
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white font-medium text-xs hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Disabling...' : 'Disable Link'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
