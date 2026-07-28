import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitBranchIcon, Link01Icon } from '@hugeicons/core-free-icons';

interface ClientGitHubCardProps {
  githubUsername?: string;
}

export const ClientGitHubCard: React.FC<ClientGitHubCardProps> = ({ githubUsername }) => {
  if (!githubUsername) return null;

  return (
    <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl space-y-3 select-none">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 min-w-0">
          <HugeiconsIcon icon={GitBranchIcon} size={16} className="text-zinc-300 shrink-0" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold truncate">
            GitHub Integration
          </h3>
        </div>

        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0 whitespace-nowrap">
          Connected
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
        <span className="text-zinc-400 shrink-0">Organization / Handle</span>
        <a
          href={`https://github.com/${githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-bold text-white hover:underline truncate max-w-full"
        >
          <span className="truncate">@{githubUsername}</span>
          <HugeiconsIcon icon={Link01Icon} size={12} className="text-zinc-500 shrink-0" />
        </a>
      </div>
    </div>
  );
};

export default ClientGitHubCard;
