import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Copy01Icon,
  Link01Icon,
  MoreVerticalIcon,
  LockKeyIcon,
  EyeIcon,
  RefreshIcon,
  CancelCircleIcon,
  Delete02Icon,
  BarChartIcon,
} from '@hugeicons/core-free-icons';
import type { ShareLinkItem } from '../lib/types/share-link';
import { getShareLinkStatus, formatShareUrl, shortenShareUrl } from '../lib/utils/share-link';
import { ShareLinkStatusBadge } from './ShareLinkStatusBadge';
import { toast } from '../../../components/ui/toast';

interface ShareLinkRowProps {
  link: ShareLinkItem;
  onOpenAnalytics: (link: ShareLinkItem) => void;
  onDisable: (link: ShareLinkItem) => void;
  onRegenerate: (link: ShareLinkItem) => void;
  onDelete: (link: ShareLinkItem) => void;
}

export const ShareLinkRow: React.FC<ShareLinkRowProps> = ({
  link,
  onOpenAnalytics,
  onDisable,
  onRegenerate,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const status = getShareLinkStatus(link);
  const fullUrl = formatShareUrl(link.token);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullUrl);
    toast.success('Share link copied to clipboard!');
  };

  const handleOpenPortal = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right });
      setIsMenuOpen(true);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setMenuPos(null);
  };

  const expiresFormatted = link.expiresAt
    ? format(new Date(link.expiresAt), 'MMM d, yyyy')
    : 'Never';

  const lastAccessFormatted = link.lastAccessedAt
    ? `${formatDistanceToNow(new Date(link.lastAccessedAt))} ago`
    : 'Never';

  const createdFormatted = formatDistanceToNow(new Date(link.createdAt));

  return (
    <tr className="hover:bg-zinc-800/40 transition-colors group select-none text-xs font-mono border-b border-zinc-800/60">
      {/* Status */}
      <td className="py-3 px-4 font-sans">
        <ShareLinkStatusBadge status={status} />
      </td>

      {/* Share URL */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 max-w-xs sm:max-w-sm">
          <span className="truncate text-zinc-300 font-mono text-[11px] group-hover:text-white" title={fullUrl}>
            {shortenShareUrl(fullUrl)}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Copy link"
            >
              <HugeiconsIcon icon={Copy01Icon} size={13} />
            </button>
            <button
              type="button"
              onClick={handleOpenPortal}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Open portal"
            >
              <HugeiconsIcon icon={Link01Icon} size={13} />
            </button>
          </div>
        </div>
      </td>

      {/* Password Protection */}
      <td className="py-3 px-4 font-sans text-zinc-400 hidden sm:table-cell">
        {link.hasPassword || link.passwordHash ? (
          <span className="inline-flex items-center gap-1.5 text-zinc-300 text-[11px]">
            <HugeiconsIcon icon={LockKeyIcon} size={12} className="text-amber-400 shrink-0" />
            <span>Protected</span>
          </span>
        ) : (
          <span className="text-zinc-600 text-[11px]">None</span>
        )}
      </td>

      {/* Expiration */}
      <td className="py-3 px-4 text-zinc-400 hidden md:table-cell">
        <span className="text-[11px] font-mono">{expiresFormatted}</span>
      </td>

      {/* Views */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1 text-zinc-300 text-[11px]">
          <HugeiconsIcon icon={EyeIcon} size={13} className="text-zinc-500 shrink-0" />
          <span>{link.currentViews}</span>
        </div>
      </td>

      {/* Last Access */}
      <td className="py-3 px-4 text-zinc-500 text-[11px] hidden lg:table-cell">
        {lastAccessFormatted}
      </td>

      {/* Created */}
      <td className="py-3 px-4 text-zinc-500 text-[11px] hidden xl:table-cell">
        {createdFormatted} ago
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <button
          type="button"
          onClick={handleMenuToggle}
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Share Link Actions"
        >
          <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
        </button>

        {/* Floating Context Menu Portal */}
        {isMenuOpen && menuPos && (
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
              }}
            />
            <div
              className="fixed z-[9999] w-48 p-1 rounded-lg bg-[#141417] border border-zinc-800 shadow-2xl font-mono text-xs text-zinc-200 text-left select-none"
              style={{
                top: `${menuPos.top}px`,
                left: `${Math.max(16, menuPos.left - 192)}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  handleCopy(e);
                  closeMenu();
                }}
                className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Copy01Icon} size={14} className="text-zinc-400" />
                <span>Copy Link</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleOpenPortal(e);
                  closeMenu();
                }}
                className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Link01Icon} size={14} className="text-zinc-400" />
                <span>Open Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onOpenAnalytics(link);
                }}
                className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={BarChartIcon} size={14} className="text-zinc-400" />
                <span>View Analytics</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onRegenerate(link);
                }}
                className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={RefreshIcon} size={14} className="text-red-400" />
                <span>Regenerate Token</span>
              </button>

              {link.isActive && (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onDisable(link);
                  }}
                  className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-zinc-300"
                >
                  <HugeiconsIcon icon={CancelCircleIcon} size={14} className="text-zinc-400" />
                  <span>Disable Link</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onDelete(link);
                }}
                className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer border-t border-zinc-800/80 mt-1 pt-1.5"
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
                <span>Delete Link</span>
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
};
