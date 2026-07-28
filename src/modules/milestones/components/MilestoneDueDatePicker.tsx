import React from 'react';
import { formatDistanceToNow, parseISO, isBefore, startOfDay } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon } from '@hugeicons/core-free-icons';
import { DatePicker } from '../../../components/ui/date-picker';

interface MilestoneDueDatePickerProps {
  dueDate: string;
  onChangeDueDate: (date: string) => void;
}

function getCountdownBadge(dueDate: string) {
  if (!dueDate) return null;
  try {
    const due = parseISO(dueDate);
    const today = startOfDay(new Date());

    if (isBefore(due, today)) {
      return { label: 'Overdue', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    }
    const distance = formatDistanceToNow(due, { addSuffix: true });
    return { label: `Due ${distance}`, badgeClass: 'bg-zinc-900 text-zinc-300 border-zinc-800' };
  } catch {
    return null;
  }
}

export const MilestoneDueDatePicker: React.FC<MilestoneDueDatePickerProps> = ({
  dueDate,
  onChangeDueDate,
}) => {
  const countdown = getCountdownBadge(dueDate);

  return (
    <div className="space-y-1 font-mono">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <HugeiconsIcon icon={Calendar01Icon} size={13} className="text-zinc-400" />
          <span>Target Completion Date</span>
        </label>
        {countdown && (
          <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold ${countdown.badgeClass}`}>
            {countdown.label}
          </span>
        )}
      </div>

      <DatePicker
        value={dueDate}
        onChange={onChangeDueDate}
        placeholder="Select target completion date..."
      />
    </div>
  );
};

export default MilestoneDueDatePicker;
