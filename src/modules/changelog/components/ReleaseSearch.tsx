import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface ReleaseSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ReleaseSearch: React.FC<ReleaseSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative flex-1 min-w-[200px] select-none font-mono">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
        <HugeiconsIcon icon={Search01Icon} size={15} />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search releases by version, title, or changes..."
        className="w-full h-9 pl-9 pr-8 rounded-lg bg-[#0c0c0e] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      )}
    </div>
  );
};
