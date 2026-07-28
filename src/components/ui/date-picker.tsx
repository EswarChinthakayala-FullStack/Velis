import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { format, parseISO } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon } from '@hugeicons/core-free-icons';
import { Calendar } from './calendar';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pick a date...',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left: number }>({ left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const left = Math.min(window.innerWidth - 270, rect.left);
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < 280) {
        setCoords({ bottom: window.innerHeight - rect.top + 6, left });
      } else {
        setCoords({ top: rect.bottom + 6, left });
      }
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const formattedLabel = value ? (
    (() => {
      try {
        return format(parseISO(value), 'MMM d, yyyy');
      } catch {
        return value;
      }
    })()
  ) : (
    <span className="text-zinc-500">{placeholder}</span>
  );

  return (
    <div className="relative w-full select-none">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-lg bg-zinc-900/90 border border-zinc-800 px-3 py-2 text-xs text-white shadow-sm hover:border-zinc-700/80 focus:outline-none transition-colors cursor-pointer',
          className
        )}
      >
        <span className="truncate font-medium">{formattedLabel}</span>
        <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-zinc-500 shrink-0" />
      </button>

      {isOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] cursor-default"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />

            <div
              className="fixed z-[9999] animate-in fade-in-0 zoom-in-95"
              style={{
                top: coords.top !== undefined ? `${coords.top}px` : undefined,
                bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
                left: `${coords.left}px`,
              }}
            >
              <Calendar selected={value} onSelect={handleSelect} />
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default DatePicker;
