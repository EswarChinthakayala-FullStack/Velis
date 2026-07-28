import React from 'react';
import { parseISO, format, differenceInDays, isAfter } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  Time01Icon,
  AlertCircleIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';

interface ProjectTimelineCardProps {
  startDate?: string;
  deadline?: string;
}

export const ProjectTimelineCard: React.FC<ProjectTimelineCardProps> = ({
  startDate,
  deadline,
}) => {
  const startParsed = startDate ? parseISO(startDate) : null;
  const deadlineParsed = deadline ? parseISO(deadline) : null;
  const today = new Date();

  const formattedStart = startParsed ? format(startParsed, 'MMM d, yyyy') : 'Not set';
  const formattedDeadline = deadlineParsed ? format(deadlineParsed, 'MMM d, yyyy') : 'Not set';

  let totalDurationDays = 0;
  if (startParsed && deadlineParsed) {
    totalDurationDays = Math.max(0, differenceInDays(deadlineParsed, startParsed));
  }

  let remainingDays = 0;
  let isOverdue = false;

  if (deadlineParsed) {
    remainingDays = differenceInDays(deadlineParsed, today);
    isOverdue = isAfter(today, deadlineParsed);
  }

  return (
    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={Calendar01Icon} size={15} className="text-zinc-400" />
          <span>Project Timeline</span>
        </div>

        {deadlineParsed && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
              isOverdue
                ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                : remainingDays <= 7
                ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
            }`}
          >
            {isOverdue ? 'Overdue' : `${remainingDays} Days Left`}
          </span>
        )}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Start Date</span>
          <span className="font-bold text-white block">{formattedStart}</span>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Deadline</span>
          <span className="font-bold text-white block">{formattedDeadline}</span>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Time01Icon} size={14} className="text-zinc-500" />
          <span>Estimated Duration:</span>
        </div>
        <span className="font-bold text-white">{totalDurationDays > 0 ? `${totalDurationDays} Days` : 'N/A'}</span>
      </div>
    </div>
  );
};

export default ProjectTimelineCard;
