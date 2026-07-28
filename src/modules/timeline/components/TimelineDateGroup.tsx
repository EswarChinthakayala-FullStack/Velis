import React from 'react';
import type { TimelineEntry } from '../lib/types/timeline';
import { TimelineEntryCard } from './TimelineEntryCard';

interface TimelineDateGroupProps {
  groupLabel: string;
  entries: TimelineEntry[];
  onDeleteEntry?: (id: string) => void;
  deletingId?: string | null;
  isReadOnly?: boolean;
}

export const TimelineDateGroup: React.FC<TimelineDateGroupProps> = ({
  groupLabel,
  entries,
  onDeleteEntry,
  deletingId,
  isReadOnly = false,
}) => {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Sticky Date Group Header */}
      <div className="sticky top-0 z-20 bg-[#09090b]/90 backdrop-blur-md py-2 border-b border-zinc-800/80 flex items-center justify-between font-mono select-none">
        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>{groupLabel}</span>
        </span>
        <span className="text-[10px] text-zinc-500 font-bold">
          {entries.length} {entries.length === 1 ? 'update' : 'updates'}
        </span>
      </div>

      {/* Group Entries Stack */}
      <div className="pt-2">
        {entries.map((entry) => (
          <TimelineEntryCard
            key={entry.id}
            entry={entry}
            onDelete={onDeleteEntry}
            isDeleting={deletingId === entry.id}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineDateGroup;
