import React, { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudUploadIcon,
  File01Icon,
  Cancel01Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import type { TimelineAttachment } from '../lib/types/timeline';
import type { UploadItem } from '../hooks/useUploadTimelineAttachment';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

interface TimelineAttachmentDropzoneProps {
  attachments: TimelineAttachment[];
  uploadQueue: UploadItem[];
  onUploadFiles: (files: File[]) => void;
  onRemoveAttachment: (id: string) => void;
  onRemoveQueueItem: (id: string) => void;
}

export const TimelineAttachmentDropzone: React.FC<TimelineAttachmentDropzoneProps> = ({
  attachments,
  uploadQueue,
  onUploadFiles,
  onRemoveAttachment,
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
        <label className="font-semibold text-zinc-300">Attachments & Media</label>
        <span className="text-[10px] text-zinc-500 font-normal">Max 25MB per file • PNG, JPG, PDF, ZIP, MP4</span>
      </div>

      {/* Drag & Drop Area */}
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
          accept="image/*,application/pdf,.zip,video/mp4,video/webm,text/plain,text/markdown"
        />

        <div className="w-10 h-10 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400 shadow-sm">
          <HugeiconsIcon icon={CloudUploadIcon} size={20} />
        </div>

        <div className="space-y-0.5">
          <p className="font-medium text-xs text-zinc-200">
            <span className="text-white underline underline-offset-2">Click to upload</span> or drag and drop files
          </p>
          <p className="text-[10px] text-zinc-500">Supports images, documents, archives, and videos</p>
        </div>
      </div>

      {/* Active Upload Queue Status */}
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
                <span className="text-[10px] text-zinc-500 shrink-0">
                  ({(item.file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>

              {item.status === 'uploading' && (
                <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0">{item.progress}%</span>
              )}

              {item.status === 'error' && (
                <span className="text-[10px] text-rose-400 font-mono truncate shrink-0">{item.error}</span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveQueueItem(item.id);
                }}
                className="text-zinc-500 hover:text-white p-0.5"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completed Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Attached Files ({attachments.length})</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-2 text-[11px] min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <HugeiconsIcon icon={File01Icon} size={13} className="text-zinc-400 shrink-0" />
                  <span className="truncate text-zinc-200">{file.fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(file.id)}
                  className="text-rose-400 hover:text-rose-300 p-0.5 shrink-0"
                  title="Remove file"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineAttachmentDropzone;
