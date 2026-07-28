import React, { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon, Image01Icon, Delete02Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { useUploadThumbnail } from '../hooks/useUploadThumbnail';

interface ThumbnailUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadMutation = useUploadThumbnail();

  const handleFileSelect = async (file: File) => {
    try {
      const result = await uploadMutation.mutateAsync(file);
      onChange(result.url);
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    uploadMutation.reset();
  };

  return (
    <div className="space-y-2 select-none">
      <label className="block text-xs font-semibold text-zinc-300">Project Cover Thumbnail</label>

      {value ? (
        /* Image Preview Box */
        <div className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 h-32 flex items-center justify-center">
          <img src={value} alt="Project Thumbnail" className="w-full h-full object-cover" />

          {/* Hover Overlay Controls */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium cursor-pointer transition-colors"
            >
              <HugeiconsIcon icon={RefreshIcon} size={14} />
              <span>Replace</span>
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-medium cursor-pointer transition-colors"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
            isDragging
              ? 'border-white bg-zinc-800/80'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
            <HugeiconsIcon icon={Image01Icon} size={20} />
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs font-medium text-white flex items-center gap-1">
              <HugeiconsIcon icon={Upload01Icon} size={14} className="text-zinc-400" />
              <span>Click to upload or drag & drop</span>
            </p>
            <p className="text-[11px] font-mono text-zinc-500">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Upload Loading Progress */}
      {uploadMutation.isPending && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Uploading thumbnail to Supabase Storage...</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="h-full bg-white animate-pulse rounded-full w-2/3" />
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadMutation.isError && (
        <p className="text-[11px] text-rose-400 font-mono pt-1">
          {uploadMutation.error.message}
        </p>
      )}
    </div>
  );
};

export default ThumbnailUploader;
