import React, { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CloudUploadIcon } from '@hugeicons/core-free-icons';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

interface MilestoneAttachmentUploaderProps {
  isUploading: boolean;
  onUploadFiles: (files: File[]) => void;
}

export const MilestoneAttachmentUploader: React.FC<MilestoneAttachmentUploaderProps> = ({
  isUploading,
  onUploadFiles,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="space-y-1.5 font-mono select-none">
      <label className="text-xs font-semibold text-zinc-300">Deliverable Specs & Attachments</label>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => e.target.files && onUploadFiles(Array.from(e.target.files))}
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 rounded-sm border border-dashed text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-white bg-zinc-900'
            : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-1.5 text-zinc-400">
          {isUploading ? (
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <RadialSpinner size={16} />
              <span>Uploading to Supabase Storage...</span>
            </div>
          ) : (
            <>
              <HugeiconsIcon icon={CloudUploadIcon} size={20} className="text-zinc-500" />
              <p className="text-xs font-semibold text-zinc-300">
                Click or drag files here to attach deliverable assets
              </p>
              <p className="text-[10px] text-zinc-500">
                Supports Images, PDF, DOCX, XLSX, ZIP (Max 25MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestoneAttachmentUploader;
