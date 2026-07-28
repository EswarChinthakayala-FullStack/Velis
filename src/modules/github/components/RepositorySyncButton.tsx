import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon } from '@hugeicons/core-free-icons';
import { RadialSpinner } from '../../projects/components/RadialSpinner';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface RepositorySyncButtonProps {
  lastSyncedAt?: string | null;
  isSyncing: boolean;
  onSync: () => void;
}

export const RepositorySyncButton: React.FC<RepositorySyncButtonProps> = ({
  lastSyncedAt,
  isSyncing,
  onSync,
}) => {
  const formattedTime = lastSyncedAt
    ? formatDistanceToNow(parseISO(lastSyncedAt), { addSuffix: true })
    : 'Never';

  return (
    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl flex items-center justify-between gap-3 select-none min-w-0">
      <div className="space-y-0.5 font-mono text-xs min-w-0 flex-1">
        <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
          <span>Supabase Synchronization</span>
        </div>
        <div className="text-zinc-500 text-[11px] truncate">
          Last synced: <span className="text-zinc-300 font-semibold">{formattedTime}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSync}
        disabled={isSyncing}
        className="h-9 px-2.5 sm:px-4 flex items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white transition-all cursor-pointer text-xs font-mono font-bold shadow-md disabled:opacity-50 shrink-0"
        title="Sync Now"
      >
        {isSyncing ? (
          <>
            <RadialSpinner size={14} className="text-amber-400" />
            <span className="text-amber-300 hidden sm:inline">Syncing...</span>
          </>
        ) : (
          <>
            <HugeiconsIcon icon={RefreshIcon} size={14} className="text-zinc-400" />
            <span className="hidden sm:inline">Sync Now</span>
          </>
        )}
      </button>
    </div>
  );
};

export default RepositorySyncButton;
