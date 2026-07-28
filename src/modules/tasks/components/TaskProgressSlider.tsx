import React, { useState } from 'react';

interface TaskProgressSliderProps {
  progress: number;
  onChangeProgress?: (newProgress: number) => void;
  disabled?: boolean;
}

export const TaskProgressSlider: React.FC<TaskProgressSliderProps> = ({
  progress,
  onChangeProgress,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(progress);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChangeProgress && val !== progress) {
      onChangeProgress(Math.min(100, Math.max(0, val)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="flex items-center gap-2 min-w-[100px] font-mono text-xs select-none">
      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-300 ${
            progress === 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-amber-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      {isEditing && onChangeProgress && !disabled ? (
        <input
          type="number"
          min={0}
          max={100}
          value={val}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setVal(isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10))}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-10 h-5 px-1 bg-zinc-900 border border-zinc-700 rounded-sm text-[11px] font-mono text-white text-center outline-none"
        />
      ) : (
        <span
          onClick={() => {
            if (onChangeProgress && !disabled) {
              setVal(progress);
              setIsEditing(true);
            }
          }}
          className={`text-[11px] font-mono font-bold min-w-[32px] text-right ${
            onChangeProgress && !disabled
              ? 'text-zinc-300 hover:text-white cursor-pointer hover:underline'
              : 'text-zinc-400'
          }`}
          title={onChangeProgress && !disabled ? 'Click to edit progress percentage' : undefined}
        >
          {progress}%
        </span>
      )}
    </div>
  );
};

export default TaskProgressSlider;
