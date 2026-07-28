import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitBranchIcon, Add01Icon } from '@hugeicons/core-free-icons';

interface RepositoryEmptyStateProps {
  onConnectRepo?: () => void;
}

export const RepositoryEmptyState: React.FC<RepositoryEmptyStateProps> = ({ onConnectRepo }) => {
  return (
    <div className="p-12 text-center border border-zinc-800/80 rounded-xl bg-[rgba(17,17,19,0.85)] backdrop-blur-xl space-y-5 max-w-lg mx-auto my-8 select-none shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto shadow-inner">
        <HugeiconsIcon icon={GitBranchIcon} size={28} />
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-bold text-white tracking-tight">
          No GitHub repository connected
        </h3>
        <p className="text-xs text-zinc-400 font-mono leading-relaxed">
          Connect a repository to automatically track releases, open issues, pull requests, and commit activity directly inside EsFlow.
        </p>
      </div>

      {onConnectRepo && (
        <button
          type="button"
          onClick={onConnectRepo}
          className="h-9 px-5 inline-flex items-center gap-2 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-colors cursor-pointer text-xs font-mono shadow-lg"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span>Connect Repository</span>
        </button>
      )}
    </div>
  );
};

export default RepositoryEmptyState;
