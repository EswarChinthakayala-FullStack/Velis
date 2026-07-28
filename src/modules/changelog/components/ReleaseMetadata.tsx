import React from 'react';
import type { ChangelogEntry } from '../types/changelog';
import { getReleaseTypeBadge, getReleaseStatusBadge, formatReleaseDate } from '../utils/release-formatters';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon, Tag01Icon, Link01Icon, RocketIcon } from '@hugeicons/core-free-icons';

interface ReleaseMetadataProps {
  entry: ChangelogEntry;
  readOnly?: boolean;
}

export const ReleaseMetadata: React.FC<ReleaseMetadataProps> = ({ entry, readOnly = false }) => {
  const dateInfo = formatReleaseDate(entry.releasedAt);
  const typeBadge = getReleaseTypeBadge(entry.releaseType);
  const statusBadge = getReleaseStatusBadge(entry.status);

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs font-mono select-none">
      {/* Release Type Badge */}
      <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${typeBadge.className}`}>
        {typeBadge.label}
      </span>

      {/* Release Status (Admin View) */}
      {!readOnly && (
        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      )}

      {/* Date info */}
      <span className="text-[11px] text-zinc-400 flex items-center gap-1.5" title={dateInfo.absolute}>
        <HugeiconsIcon icon={Calendar01Icon} size={12} className="text-zinc-500" />
        <span>{dateInfo.absolute}</span>
        {dateInfo.relative && <span className="text-zinc-500">({dateInfo.relative})</span>}
      </span>

      {/* Environment info */}
      {entry.environment && (
        <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono inline-flex items-center gap-1">
          <HugeiconsIcon icon={RocketIcon} size={11} className="text-sky-400" />
          <span className="capitalize">{entry.environment}</span>
        </span>
      )}

      {/* GitHub Repository Link */}
      {entry.githubReleaseUrl && (
        <a
          href={entry.githubReleaseUrl}
          target="_blank"
          rel="noreferrer"
          className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-300 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={Link01Icon} size={11} className="text-sky-400" />
          <span>GitHub Release</span>
        </a>
      )}
    </div>
  );
};
