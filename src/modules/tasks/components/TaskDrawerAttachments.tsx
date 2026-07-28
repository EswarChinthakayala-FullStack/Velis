import React, { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudUploadIcon,
  File01Icon,
  Cancel01Icon,
  Download01Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import type { TaskAttachmentItem } from '../lib/types/task';
import type { TaskUploadItem } from '../hooks/useUploadTaskAttachment';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

interface TaskDrawerAttachmentsProps {
  attachments: TaskAttachmentItem[];
  uploadQueue: TaskUploadItem[];
  onUploadFiles: (files: File[]) => void;
  onDeleteAttachment: (attachment: TaskAttachmentItem) => void;
  onRemoveQueueItem: (id: string) => void;
}

export const TaskDrawerAttachments: React.FC<TaskDrawerAttachmentsProps> = ({
  attachments,
  uploadQueue,
  onUploadFiles,
  onDeleteAttachment,
  onRemoveQueueItem,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-3 font-mono text-xs select-none">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-zinc-300">Attachments & Documents</label>
        <span className="text-[10px] text-zinc-500 font-normal">Max 25MB • Supabase Storage</span>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 rounded-sm border border-dashed transition-all cursor-pointer text-center space-y-2 ${
          isDragOver
            ? 'border-white bg-zinc-900/80 text-white'
            : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/50 text-zinc-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-9 h-9 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
          <HugeiconsIcon icon={CloudUploadIcon} size={18} />
        </div>

        <p className="text-xs text-zinc-300">
          <span className="text-white underline underline-offset-2">Upload attachment</span> or drag files here
        </p>
      </div>

      {/* Active Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Uploading ({uploadQueue.length})</div>
          {uploadQueue.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-2 text-[11px]"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {item.status === 'uploading' ? (
                  <RadialSpinner size={13} className="text-amber-400 shrink-0" />
                ) : item.status === 'error' ? (
                  <HugeiconsIcon icon={AlertCircleIcon} size={13} className="text-rose-400 shrink-0" />
                ) : (
                  <HugeiconsIcon icon={File01Icon} size={13} className="text-emerald-400 shrink-0" />
                )}
                <span className="truncate text-zinc-200">{item.file.name}</span>
              </div>

              {item.status === 'uploading' && (
                <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0">{item.progress}%</span>
              )}

              <button
                type="button"
                onClick={() => onRemoveQueueItem(item.id)}
                className="text-zinc-500 hover:text-white p-0.5"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Attachments List Grid */}
      {attachments.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Task Attachments ({attachments.length})</div>
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
                    title="Download attachment"
                  >
                    <HugeiconsIcon icon={Download01Icon} size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => onDeleteAttachment(file)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Delete attachment"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDrawerAttachments;
