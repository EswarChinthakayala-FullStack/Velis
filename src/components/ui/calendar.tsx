import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export interface CalendarProps {
  selected?: string; // YYYY-MM-DD
  onSelect?: (dateString: string) => void;
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ selected, onSelect, className }) => {
  const initialDate = selected ? parseISO(selected) : new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(isNaN(initialDate.getTime()) ? new Date() : initialDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const selectedDate = selected ? parseISO(selected) : null;

  const handleDateClick = (day: Date) => {
    const formatted = format(day, 'yyyy-MM-dd');
    onSelect?.(formatted);
  };

  return (
    <div className={cn('p-3 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl w-64 select-none text-xs text-white', className)}>
      {/* Header Month Navigation */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
        <span className="font-bold text-white tracking-tight text-xs">
          {format(currentMonth, 'MMMM yyyy')}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>

          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-zinc-500 pb-1 font-semibold">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => {
          const isSelectedDay = selectedDate ? isSameDay(day, selectedDate) : false;
          const isCurrentMonthDay = isSameMonth(day, currentMonth);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDateClick(day)}
              className={cn(
                'h-7 w-7 flex items-center justify-center rounded-lg font-mono text-[11px] transition-all cursor-pointer mx-auto',
                !isCurrentMonthDay && 'text-zinc-600',
                isCurrentMonthDay && !isSelectedDay && 'text-zinc-300 hover:bg-zinc-800 hover:text-white',
                isSelectedDay && 'bg-white text-black font-bold shadow-md'
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
