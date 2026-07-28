import React, { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudUploadIcon,
  File01Icon,
  Cancel01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons';
import type { MilestoneAttachmentItem } from '../lib/types/milestone';
import { uploadMilestoneAttachmentFile, deleteMilestoneAttachmentFile } from '../lib/storage/milestone-attachments';
import { createMilestoneAttachmentRecord, deleteMilestoneAttachmentRecord } from '../../../lib/supabase/queries/milestones';
import { useQueryClient } from '@tanstack/react-query';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

interface MilestoneAttachmentsProps {
  milestoneId: string;
  attachments?: MilestoneAttachmentItem[];
  readOnly?: boolean;
}

export const MilestoneAttachments: React.FC<MilestoneAttachmentsProps> = ({
  milestoneId,
  attachments = [],
  readOnly = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0 || readOnly) return;
    setIsUploading(true);

    try {
      for (const file of files) {
        const { fileName, fileUrl } = await uploadMilestoneAttachmentFile(milestoneId, file);
        await createMilestoneAttachmentRecord(milestoneId, fileName, fileUrl);
      }

      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    } catch {
      // Error handling
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (file: MilestoneAttachmentItem) => {
    if (readOnly) return;
    try {
      await deleteMilestoneAttachmentFile(file.fileUrl);
      await deleteMilestoneAttachmentRecord(file.id);
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    } catch {
      // Error handling
    }
  };

  return (
    <div className="space-y-3 font-mono text-xs select-none">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-zinc-300">Deliverable Assets & Specs</label>
        {isUploading && (
          <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
            <RadialSpinner size={12} />
            <span>Uploading...</span>
          </span>
        )}
      </div>

      {/* Attachments List */}
      {attachments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="p-2.5 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-2 text-[11px] min-w-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <HugeiconsIcon icon={File01Icon} size={14} className="text-zinc-400 shrink-0" />
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-zinc-200 hover:text-white hover:underline"
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
                  className="text-zinc-500 hover:text-white p-1"
                  title="Download asset"
                >
                  <HugeiconsIcon icon={Download01Icon} size={13} />
                </a>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAttachment(file)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    title="Remove asset"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-600 italic">No assets attached to this milestone.</p>
      )}

      {/* Upload button for Admin */}
      {!readOnly && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={CloudUploadIcon} size={13} />
            <span>Upload Asset</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MilestoneAttachments;
