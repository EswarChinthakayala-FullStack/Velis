import React from 'react';
import { parseISO, differenceInDays } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { HourglassIcon } from '@hugeicons/core-free-icons';

interface DurationPreviewProps {
  startDate?: string;
  deadline?: string;
}

export const DurationPreview: React.FC<DurationPreviewProps> = ({ startDate, deadline }) => {
  if (!startDate || !deadline) return null;

  try {
    const start = parseISO(startDate);
    const end = parseISO(deadline);
    const days = differenceInDays(end, start);

    if (days < 0) return null;

    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 font-mono">
        <HugeiconsIcon icon={HourglassIcon} size={14} className="text-zinc-400 shrink-0" />
        <span>
          Estimated Duration: <strong className="text-white">{days + 1} Days</strong>
        </span>
      </div>
    );
  } catch {
    return null;
  }
};

export default DurationPreview;
