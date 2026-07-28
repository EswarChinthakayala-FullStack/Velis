import React from 'react';
import type { DocumentItem } from '../lib/types/documentation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon,
  Clock01Icon,
  Tag01Icon,
  EyeIcon,
  LockKeyIcon,
} from '@hugeicons/core-free-icons';

interface DocumentMetadataProps {
  document: DocumentItem;
}

export const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document: doc }) => {
  return (
    <div className="py-3 px-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 font-mono text-xs text-zinc-400 flex items-center justify-between gap-4 flex-wrap select-none my-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Author */}
        <div className="flex items-center gap-1.5" title="Document Author">
          <HugeiconsIcon icon={UserIcon} size={14} className="text-zinc-500" />
          <span className="text-zinc-200 font-semibold">{doc.author || 'System Lead'}</span>
        </div>

        {/* Version Badge */}
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 rounded-sm bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300">
            v{doc.version}
          </span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]" title="Last Updated">
          <HugeiconsIcon icon={Clock01Icon} size={13} />
          <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-1">
          {doc.isClientVisible ? (
            <span className="px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
              <HugeiconsIcon icon={EyeIcon} size={11} />
              <span>Client Visible</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1">
              <HugeiconsIcon icon={LockKeyIcon} size={11} />
              <span>Internal Only</span>
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      {doc.tags && doc.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <HugeiconsIcon icon={Tag01Icon} size={13} className="text-zinc-500" />
          {doc.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-sm bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentMetadata;
