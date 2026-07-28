import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  BarChartIcon,
  EyeIcon,
  Clock01Icon,
  LockKeyIcon,
  Copy01Icon,
  Link01Icon,
} from '@hugeicons/core-free-icons';
import type { ShareLinkItem } from '../lib/types/share-link';
import { formatShareUrl, shortenShareUrl } from '../lib/utils/share-link';
import { ShareLinkStatusBadge } from './ShareLinkStatusBadge';
import { getShareLinkStatus } from '../lib/utils/share-link';
import { toast } from '../../../components/ui/toast';

interface ShareAnalyticsDrawerProps {
  isOpen: boolean;
  link: ShareLinkItem | null;
  onClose: () => void;
}

export const ShareAnalyticsDrawer: React.FC<ShareAnalyticsDrawerProps> = ({
  isOpen,
  link,
  onClose,
}) => {
  if (!isOpen || !link) return null;

  const url = formatShareUrl(link.token);
  const status = getShareLinkStatus(link);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  const handleOpenPortal = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md h-full bg-[#0c0c0e] border-l border-zinc-800 shadow-2xl flex flex-col justify-between font-sans text-zinc-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700/60">
                <HugeiconsIcon icon={BarChartIcon} size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Link Analytics</h3>
                <p className="text-xs text-zinc-400">Portal usage & access stats</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
            {/* Status & Short URL */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">Current Status</span>
                <ShareLinkStatusBadge status={status} />
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-300 flex items-center justify-between">
                <span className="truncate max-w-[240px]">{shortenShareUrl(url)}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Link"
                  >
                    <HugeiconsIcon icon={Copy01Icon} size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenPortal}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Open Portal"
                  >
                    <HugeiconsIcon icon={Link01Icon} size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <HugeiconsIcon icon={EyeIcon} size={14} className="text-zinc-500" />
                  <span>Total Views</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {link.currentViews}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <HugeiconsIcon icon={LockKeyIcon} size={14} className="text-amber-400" />
                  <span>Protection</span>
                </div>
                <div className="text-sm font-semibold font-mono text-zinc-200">
                  {link.hasPassword || link.passwordHash ? 'Password Protected' : 'Public'}
                </div>
              </div>
            </div>

            {/* Timestamp Information */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-400">Created Date</span>
                <span>{format(new Date(link.createdAt), 'MMM d, yyyy HH:mm')}</span>
              </div>

              <div className="flex items-center justify-between text-zinc-300 border-t border-zinc-800/60 pt-2">
                <span className="text-zinc-400">Expiration</span>
                <span>{link.expiresAt ? format(new Date(link.expiresAt), 'MMM d, yyyy') : 'Never'}</span>
              </div>

              <div className="flex items-center justify-between text-zinc-300 border-t border-zinc-800/60 pt-2">
                <span className="text-zinc-400">Last Accessed</span>
                <span>{link.lastAccessedAt ? `${formatDistanceToNow(new Date(link.lastAccessedAt))} ago` : 'Never'}</span>
              </div>
            </div>

            {/* Notes if available */}
            {link.notes && (
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <span className="text-xs font-mono text-zinc-400">Internal Note</span>
                <p className="text-xs text-zinc-300 font-sans italic">{link.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-xs font-medium hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
