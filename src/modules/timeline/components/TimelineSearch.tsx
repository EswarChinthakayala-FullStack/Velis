import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface TimelineSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const TimelineSearch: React.FC<TimelineSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search updates by title, content, or tags...',
}) => {
  return (
    <div className="relative flex items-center font-mono">
      <div className="absolute left-3 text-zinc-500 pointer-events-none">
        <HugeiconsIcon icon={Search01Icon} size={15} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 bg-zinc-950/80 border border-zinc-800/90 rounded-sm text-xs font-mono text-white placeholder-zinc-500 outline-none hover:border-zinc-700 focus:border-zinc-500 transition-colors"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Clear search"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      )}
    </div>
  );
};

export default TimelineSearch;
