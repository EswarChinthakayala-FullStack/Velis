import React from 'react';
import type { GitHubReleaseItem } from '../types/github';
import { format, parseISO } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, Tag01Icon, Link01Icon } from '@hugeicons/core-free-icons';

interface RepositoryReleasesProps {
  releases: GitHubReleaseItem[] | undefined;
  isLoading?: boolean;
}

export const RepositoryReleases: React.FC<RepositoryReleasesProps> = ({ releases, isLoading }) => {
  if (isLoading) {
    return <div className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  const latestRelease = releases && releases.length > 0 ? releases[0] : null;

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={SparklesIcon} size={15} className="text-amber-400" />
          <span>Latest Release</span>
        </div>
        {releases && releases.length > 0 && (
          <span className="text-[11px] font-mono text-zinc-500">{releases.length} Total Releases</span>
        )}
      </div>

      {!latestRelease ? (
        <div className="p-6 text-center text-xs text-zinc-500 font-mono italic">
          No releases published yet.
        </div>
      ) : (
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold text-xs flex items-center gap-1">
                <HugeiconsIcon icon={Tag01Icon} size={13} />
                <span>{latestRelease.tag_name}</span>
              </span>

              {latestRelease.prerelease && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Pre-release
                </span>
              )}

              {latestRelease.draft && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700">
                  Draft
                </span>
              )}
            </div>

            <a
              href={latestRelease.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View Release</span>
              <HugeiconsIcon icon={Link01Icon} size={12} />
            </a>
          </div>

          {latestRelease.name && (
            <h4 className="text-sm font-bold text-white tracking-tight">
              {latestRelease.name}
            </h4>
          )}

          {latestRelease.body && (
            <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
              {latestRelease.body}
            </p>
          )}

          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
            <span>By {latestRelease.author?.login}</span>
            <span>
              {latestRelease.published_at
                ? format(parseISO(latestRelease.published_at), 'MMM d, yyyy')
                : 'Draft'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryReleases;
