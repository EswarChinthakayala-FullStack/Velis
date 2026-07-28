import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification01Icon, RefreshIcon, Settings01Icon } from '@hugeicons/core-free-icons';

interface NotificationEmptyProps {
  onRefresh?: () => void;
  onOpenSettings?: () => void;
}

export const NotificationEmptyState: React.FC<NotificationEmptyProps> = ({
  onRefresh,
  onOpenSettings,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-zinc-950/40 border border-zinc-800/40 text-center select-none font-mono my-6">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-xl">
        <HugeiconsIcon icon={Notification01Icon} size={28} />
      </div>

      <h3 className="text-sm font-bold text-white font-sans">Inbox Zero</h3>
      <p className="text-xs text-zinc-400 font-mono max-w-sm mt-1 leading-relaxed">
        No notifications found matching your current filters. Everything across projects, deployments, and clients is up to date.
      </p>

      <div className="flex items-center gap-3 mt-6">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="h-8 px-3.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={RefreshIcon} size={13} />
            <span>Refresh Inbox</span>
          </button>
        )}

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="h-8 px-3.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Settings01Icon} size={13} />
            <span>Preferences</span>
          </button>
        )}
      </div>
    </div>
  );
};
