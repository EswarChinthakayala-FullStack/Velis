import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitBranchIcon, Cancel01Icon, Link01Icon } from '@hugeicons/core-free-icons';

interface RepositoryUrlInputProps {
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  error?: string | null;
  isDisabled?: boolean;
  placeholder?: string;
}

export const RepositoryUrlInput: React.FC<RepositoryUrlInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  isDisabled = false,
  placeholder = 'https://github.com/owner/repository',
}) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-1.5 font-mono">
      <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Link01Icon} size={13} className="text-amber-400" />
          <span>Repository URL</span>
          <span className="text-rose-400">*</span>
        </span>
        <span className="text-[10px] text-zinc-500 font-normal">HTTPS only</span>
      </label>

      <div className="relative flex items-center">
        <div className="absolute left-3 text-zinc-500 pointer-events-none">
          <HugeiconsIcon icon={GitBranchIcon} size={16} />
        </div>

        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={isDisabled}
          placeholder={placeholder}
          className={`w-full pl-9 pr-9 py-2.5 bg-zinc-950/80 border rounded-lg text-xs font-mono text-white placeholder-zinc-600 outline-none transition-all ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
              : 'border-zinc-800 hover:border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600/30'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        {value && !isDisabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Clear URL"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default RepositoryUrlInput;
