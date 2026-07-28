import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { LockIcon, PencilEdit01Icon } from '@hugeicons/core-free-icons';

interface SlugInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const SlugInput: React.FC<SlugInputProps> = ({ value, onChange, error }) => {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="space-y-1.5 select-none">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-300">
          URL Slug <span className="text-rose-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={isLocked ? LockIcon : PencilEdit01Icon} size={13} />
          <span>{isLocked ? 'Auto-generated' : 'Custom'}</span>
        </button>
      </div>

      <div className="relative flex items-center">
        <span className="absolute left-3 text-xs font-mono text-zinc-500 select-none">
          /projects/
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          disabled={isLocked}
          placeholder="project-slug"
          className="w-full pl-22 pr-3.5 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white font-mono text-xs outline-none transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
        />
      </div>

      {error && <p className="text-[11px] text-rose-400 font-mono pt-0.5">{error}</p>}
    </div>
  );
};

export default SlugInput;
