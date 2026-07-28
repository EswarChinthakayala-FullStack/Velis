import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tag01Icon } from '@hugeicons/core-free-icons';

interface RepositoryTopicsProps {
  topics: string[] | undefined;
  isLoading?: boolean;
}

export const RepositoryTopics: React.FC<RepositoryTopicsProps> = ({ topics, isLoading }) => {
  if (isLoading) {
    return <div className="h-20 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  if (!topics || topics.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-3">
      <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
        <HugeiconsIcon icon={Tag01Icon} size={15} className="text-zinc-400" />
        <span>Repository Topics</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {topics.map((topic) => (
          <span
            key={topic}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors"
          >
            #{topic}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RepositoryTopics;
