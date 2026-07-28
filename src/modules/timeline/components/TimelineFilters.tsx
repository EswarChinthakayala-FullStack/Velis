import React from 'react';
import type { TimelineUpdateType } from '../lib/types/timeline';
import { UPDATE_TYPE_CONFIGS } from '../lib/utils/timeline-formatters';
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterIcon } from '@hugeicons/core-free-icons';

interface TimelineFiltersProps {
  selectedType: 'all' | TimelineUpdateType;
  onSelectType: (type: 'all' | TimelineUpdateType) => void;
  selectedVisibility: 'all' | 'public' | 'private';
  onSelectVisibility: (visibility: 'all' | 'public' | 'private') => void;
}

const CATEGORIES: { id: 'all' | TimelineUpdateType; label: string }[] = [
  { id: 'all', label: 'All Updates' },
  { id: 'feature', label: 'Features' },
  { id: 'bug_fix', label: 'Bug Fixes' },
  { id: 'deployment', label: 'Deployments' },
  { id: 'milestone', label: 'Milestones' },
  { id: 'documentation', label: 'Docs' },
];

export const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar font-mono text-xs select-none">
      <div className="flex items-center gap-1 text-zinc-500 pr-2 border-r border-zinc-800 shrink-0">
        <HugeiconsIcon icon={FilterIcon} size={13} />
        <span className="text-[11px] uppercase tracking-wider font-bold">Filter:</span>
      </div>

      {CATEGORIES.map((cat) => {
        const isActive = selectedType === cat.id;
        const config = cat.id !== 'all' ? UPDATE_TYPE_CONFIGS[cat.id] : null;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectType(cat.id)}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
              isActive
                ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                : 'bg-zinc-950/60 text-zinc-400 border-zinc-800/80 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            {config && <HugeiconsIcon icon={config.icon} size={12} />}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TimelineFilters;
