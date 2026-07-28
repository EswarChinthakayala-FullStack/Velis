import React from 'react';
import type { NotificationCategory, NotificationFilterState, NotificationPriority, NotificationType } from './types/notification';

interface NotificationFiltersProps {
  filters: NotificationFilterState;
  onFilterChange: (updated: Partial<NotificationFilterState>) => void;
}

const CATEGORIES: { value: 'all' | NotificationCategory; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'projects', label: 'Projects' },
  { value: 'clients', label: 'Clients' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'github', label: 'GitHub' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'payments', label: 'Payments' },
  { value: 'notes', label: 'Notes' },
  { value: 'changelog', label: 'Changelog' },
  { value: 'share_links', label: 'Share Links' },
  { value: 'security', label: 'Security' },
  { value: 'system', label: 'System' },
];

const PRIORITIES: { value: 'all' | NotificationPriority; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' },
];

const TYPES: { value: 'all' | NotificationType; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
];

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs select-none">
      {/* Category Select */}
      <select
        value={filters.category}
        onChange={(e) => onFilterChange({ category: e.target.value as any })}
        className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white outline-none focus:border-zinc-700 cursor-pointer font-mono"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value} className="bg-zinc-900 text-white">
            {c.label}
          </option>
        ))}
      </select>

      {/* Priority Select */}
      <select
        value={filters.priority}
        onChange={(e) => onFilterChange({ priority: e.target.value as any })}
        className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white outline-none focus:border-zinc-700 cursor-pointer font-mono"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value} className="bg-zinc-900 text-white">
            {p.label}
          </option>
        ))}
      </select>

      {/* Type Select */}
      <select
        value={filters.type}
        onChange={(e) => onFilterChange({ type: e.target.value as any })}
        className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white outline-none focus:border-zinc-700 cursor-pointer font-mono"
      >
        {TYPES.map((t) => (
          <option key={t.value} value={t.value} className="bg-zinc-900 text-white">
            {t.label}
          </option>
        ))}
      </select>

      {/* Sort Select */}
      <select
        value={filters.sort}
        onChange={(e) => onFilterChange({ sort: e.target.value as any })}
        className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white outline-none focus:border-zinc-700 cursor-pointer font-mono"
      >
        <option value="newest" className="bg-zinc-900 text-white">
          Newest First
        </option>
        <option value="oldest" className="bg-zinc-900 text-white">
          Oldest First
        </option>
      </select>
    </div>
  );
};
