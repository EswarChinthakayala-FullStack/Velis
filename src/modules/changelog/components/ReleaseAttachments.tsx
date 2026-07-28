import React from 'react';
import type { ChangelogAttachment } from '../types/changelog';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download01Icon, Folder01Icon, DocumentCodeIcon, Image01Icon } from '@hugeicons/core-free-icons';

interface ReleaseAttachmentsProps {
  attachments?: ChangelogAttachment[];
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(name: string, mimeType?: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext || '')) return Image01Icon;
  if (['zip', 'tar', 'gz', 'rar'].includes(ext || '')) return Folder01Icon;
  return DocumentCodeIcon;
}

export const ReleaseAttachments: React.FC<ReleaseAttachmentsProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-2 pt-3 border-t border-zinc-800/60 font-mono select-none">
      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
        <HugeiconsIcon icon={Folder01Icon} size={13} className="text-zinc-500" />
        <span>Release Assets & Artifacts ({attachments.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {attachments.map((file) => {
          const Icon = getFileIcon(file.name, file.mimeType);
          return (
            <a
              key={file.id || file.url}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              download={file.name}
              className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-between gap-3 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white shrink-0">
                  <HugeiconsIcon icon={Icon} size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate max-w-[180px] sm:max-w-[220px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">{formatBytes(file.size)}</p>
                </div>
              </div>

              <div className="p-1 rounded bg-zinc-800 text-zinc-400 group-hover:text-white shrink-0">
                <HugeiconsIcon icon={Download01Icon} size={13} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
