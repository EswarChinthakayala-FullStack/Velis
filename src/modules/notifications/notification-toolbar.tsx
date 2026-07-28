import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, CheckmarkCircle02Icon, Settings01Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { NotificationFilters } from './notification-filters';
import type { NotificationFilterState } from './types/notification';

interface NotificationToolbarProps {
  filters: NotificationFilterState;
  onFilterChange: (updated: Partial<NotificationFilterState>) => void;
  onMarkAllRead: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
  isMarkingAllPending?: boolean;
}

export const NotificationToolbar: React.FC<NotificationToolbarProps> = ({
  filters,
  onFilterChange,
  onMarkAllRead,
  onOpenSettings,
  onRefresh,
  isMarkingAllPending = false,
}) => {
  return (
    <div className="space-y-3 font-mono select-none">
      {/* Primary Toolbar Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl shadow-lg">
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-0">
          <HugeiconsIcon
            icon={Search01Icon}
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search inbox by title, category, project, or description..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 font-mono outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh Notification Stream"
            className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={RefreshIcon} size={15} />
          </button>

          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={isMarkingAllPending}
            className="h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Mark All Read</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            title="Notification Preferences"
            className="h-9 px-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Settings01Icon} size={14} />
            <span className="hidden sm:inline">Preferences</span>
          </button>
        </div>
      </div>

      {/* Secondary Filter Dropdowns & Tab Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Navigation Tabs (All, Unread, Read, Archived) */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-950/80 border border-zinc-800/80 shrink-0">
          {(['all', 'unread', 'read', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onFilterChange({ tab })}
              className={`h-7 px-3 rounded-md text-xs font-mono capitalize transition-all cursor-pointer ${
                filters.tab === tab
                  ? 'bg-zinc-800 text-white font-semibold shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <NotificationFilters filters={filters} onFilterChange={onFilterChange} />
      </div>
    </div>
  );
};
