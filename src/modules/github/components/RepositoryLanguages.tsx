import React from 'react';
import type { GitHubLanguageDistribution } from '../types/github';
import { HugeiconsIcon } from '@hugeicons/react';
import { CodeCircleIcon } from '@hugeicons/core-free-icons';

interface RepositoryLanguagesProps {
  languages: GitHubLanguageDistribution | undefined;
  isLoading?: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

export const RepositoryLanguages: React.FC<RepositoryLanguagesProps> = ({ languages, isLoading }) => {
  if (isLoading) {
    return <div className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  if (!languages || Object.keys(languages).length === 0) {
    return null;
  }

  const totalBytes = Object.values(languages).reduce((acc, bytes) => acc + bytes, 0);
  if (totalBytes === 0) return null;

  const items = Object.entries(languages)
    .map(([lang, bytes]) => ({
      name: lang,
      bytes,
      percent: ((bytes / totalBytes) * 100).toFixed(1),
      color: LANGUAGE_COLORS[lang] || '#a1a1aa',
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={CodeCircleIcon} size={15} className="text-zinc-400" />
          <span>Language Breakdown</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">{items.length} Languages</span>
      </div>

      {/* Segmented Bar */}
      <div className="h-3.5 w-full rounded-full bg-zinc-950 overflow-hidden flex border border-zinc-800/80">
        {items.map((item) => (
          <div
            key={item.name}
            style={{ width: `${item.percent}%`, backgroundColor: item.color }}
            className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            title={`${item.name}: ${item.percent}%`}
          />
        ))}
      </div>

      {/* Percentages Chips */}
      <div className="flex items-center gap-4 flex-wrap text-xs font-mono">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-zinc-200 font-semibold">{item.name}</span>
            <span className="text-zinc-500">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoryLanguages;
