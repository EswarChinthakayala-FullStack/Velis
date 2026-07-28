import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon, Search01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { useAuth } from '../../auth/auth-hooks';

interface DashboardHeaderProps {
  onRefreshAll?: () => void;
  onOpenSearch?: () => void;
  onNewProject?: () => void;
  lastSynced?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefreshAll,
  onOpenSearch,
  onNewProject,
  lastSynced = 'Just now',
}) => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Eswar';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-2 select-none pb-3 border-b border-zinc-800/60">
      {/* Top Row: Title (Left) & Actions (Right) */}
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Left: Title + Desktop Date Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight shrink-0">
            Dashboard
          </h1>
          <span className="hidden sm:inline-flex px-2.5 py-1 text-[10px] font-mono font-medium rounded-full bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 shrink-0 truncate">
            {currentDate}
          </span>
        </div>

        {/* Right: Controls (All h-9 equal height, no overlap) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sync Indicator (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 h-9 px-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-[11px] text-zinc-400 font-mono shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced: {lastSynced}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefreshAll}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/80 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
            title="Refresh All Dashboard Widgets"
            aria-label="Refresh All Dashboard Widgets"
          >
            <HugeiconsIcon icon={RefreshIcon} size={15} />
          </button>

          {/* Global Search Button (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/80 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
          >
            <HugeiconsIcon icon={Search01Icon} size={14} className="text-zinc-500" />
            <span>Search (⌘K)</span>
          </button>

          {/* Quick New Project Button */}
          <button
            onClick={onNewProject}
            className="h-9 px-3.5 flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-lg shrink-0"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={14} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Subtitle Row (Includes Mobile Date Badge) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-zinc-400">
        <p className="font-normal leading-relaxed">
          Welcome back, <span className="text-white font-medium">{userName}</span>. Here's what's happening across your project operations center today.
        </p>

        {/* Mobile Date Badge */}
        <span className="sm:hidden inline-flex w-fit px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 mt-0.5">
          {currentDate}
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;
