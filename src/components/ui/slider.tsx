import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = 0, onValueChange, min = 0, max = 100, step = 1, disabled, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      onValueChange?.(val);
    };

    return (
      <div className={cn('relative flex w-full touch-none select-none items-center py-1.5', className)}>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800 border border-zinc-700/60">
          <div
            className="h-full bg-white transition-all duration-150 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
export default Slider;
