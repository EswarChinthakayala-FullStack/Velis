import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitBranchIcon, Search01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import type { GitHubBranchItem } from '../lib/github/types';

interface BranchSelectorProps {
  value: string;
  onChange: (branch: string) => void;
  branches: GitHubBranchItem[];
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  value,
  onChange,
  branches,
  isLoading = false,
  isDisabled = false,
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [manualInput, setManualInput] = useState(false);

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-1.5 font-mono text-xs relative">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
          <HugeiconsIcon icon={GitBranchIcon} size={13} className="text-amber-400" />
          <span>Default Branch</span>
          <span className="text-rose-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => setManualInput(!manualInput)}
          className="text-[10px] text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
        >
          {manualInput ? 'Select from list' : 'Manual entry'}
        </button>
      </div>

      {manualInput ? (
        <div className="relative flex items-center">
          <div className="absolute left-3 text-zinc-500 pointer-events-none">
            <HugeiconsIcon icon={GitBranchIcon} size={14} />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. main, master, dev"
            disabled={isDisabled}
            className="w-full pl-8 pr-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
          />
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => !isDisabled && setIsOpen(!isOpen)}
            disabled={isDisabled}
            className={`w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs font-mono text-white flex items-center justify-between hover:border-zinc-700 outline-none ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <HugeiconsIcon icon={GitBranchIcon} size={14} className="text-amber-400 shrink-0" />
              <span className="font-semibold truncate">{value || 'Select branch...'}</span>
            </div>
            <span className="text-[10px] text-zinc-500 shrink-0">
              {isLoading ? 'Loading...' : `(${branches.length} branches)`}
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1 p-2 bg-[#111113] border border-zinc-800 rounded-lg shadow-2xl space-y-2 max-h-56 overflow-y-auto">
              <div className="relative flex items-center">
                <HugeiconsIcon icon={Search01Icon} size={13} className="absolute left-2.5 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search branch..."
                  className="w-full pl-7 pr-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-mono text-white outline-none focus:border-zinc-700"
                  autoFocus
                />
              </div>

              <div className="space-y-0.5">
                {filteredBranches.length === 0 ? (
                  <div className="p-2 text-[11px] text-zinc-500 text-center font-mono">
                    No matching branches found.
                  </div>
                ) : (
                  filteredBranches.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => {
                        onChange(b.name);
                        setIsOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-mono flex items-center justify-between hover:bg-zinc-800 transition-colors ${
                        value === b.name ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-300'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      {value === b.name && (
                        <HugeiconsIcon icon={Tick02Icon} size={13} className="text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BranchSelector;
