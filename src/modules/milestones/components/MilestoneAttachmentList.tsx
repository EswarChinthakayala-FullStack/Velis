import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon, Download01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import type { MilestoneAttachmentItem } from '../lib/types/milestone';

interface MilestoneAttachmentListProps {
  attachments: MilestoneAttachmentItem[];
  onDeleteAttachment?: (attachment: MilestoneAttachmentItem) => void;
}

export const MilestoneAttachmentList: React.FC<MilestoneAttachmentListProps> = ({
  attachments,
  onDeleteAttachment,
}) => {
  if (attachments.length === 0) return null;

  return (
    <div className="space-y-1.5 font-mono select-none">
      <p className="text-[11px] font-semibold text-zinc-400">Attached Assets ({attachments.length})</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {attachments.map((file) => (
          <div
            key={file.id}
            className="p-2.5 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-2 text-xs min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <HugeiconsIcon icon={File01Icon} size={14} className="text-zinc-400 shrink-0" />
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate text-zinc-200 hover:text-white hover:underline text-[11px]"
                title={file.fileName}
              >
                {file.fileName}
              </a>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={file.fileUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="p-1 text-zinc-500 hover:text-white"
                title="Download asset"
              >
                <HugeiconsIcon icon={Download01Icon} size={13} />
              </a>

              {onDeleteAttachment && (
                <button
                  type="button"
                  onClick={() => onDeleteAttachment(file)}
                  className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                  title="Remove asset"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneAttachmentList;
