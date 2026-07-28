import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';

interface SearchTriggerProps {
  onClick?: () => void;
}

export const SearchTrigger: React.FC<SearchTriggerProps> = ({ onClick }) => {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/80 rounded-lg text-xs text-zinc-400 hover:text-white transition-all cursor-pointer shadow-inner group w-48 sm:w-64"
      aria-label="Search projects, clients, files and docs"
    >
      <HugeiconsIcon
        icon={Search01Icon}
        size={16}
        className="text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0"
      />
      <span className="truncate flex-1 text-left">Search workspace...</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-zinc-400 bg-zinc-800/90 border border-zinc-700/60 rounded shadow-sm">
        {isMac ? '⌘' : 'Ctrl'} K
      </kbd>
    </button>
  );
};

export default SearchTrigger;
