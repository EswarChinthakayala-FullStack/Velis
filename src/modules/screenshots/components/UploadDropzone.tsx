import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ALLOWED_MIME_TYPES } from '../lib/utils/mime-utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon, Image01Icon } from '@hugeicons/core-free-icons';

interface UploadDropzoneProps {
  onDropFiles: (files: File[]) => void;
  disabled?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onDropFiles,
  disabled = false,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      if (accepted.length > 0) onDropFiles(accepted);
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'],
    },
    disabled,
    multiple: true,
  });

  // Clipboard Paste (Ctrl+V / Cmd+V) Handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        onDropFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onDropFiles, disabled]);

  return (
    <div
      {...getRootProps()}
      className={`relative p-8 rounded-lg border-2 border-dashed transition-all cursor-pointer select-none text-center font-mono ${
        isDragActive
          ? 'border-white bg-zinc-900/80 scale-[1.01]'
          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
          <HugeiconsIcon icon={isDragActive ? Image01Icon : Upload01Icon} size={22} />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-white font-sans">
            {isDragActive ? 'Drop screenshots here...' : 'Drag & Drop progress screenshots here'}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">
            or click to browse from device · Clipboard paste (<kbd className="px-1 bg-zinc-900 border border-zinc-800 rounded">Ctrl+V</kbd>) supported
          </p>
        </div>

        <span className="text-[10px] text-zinc-600 font-mono">
          PNG, JPG, WEBP, GIF, AVIF up to 50MB
        </span>
      </div>
    </div>
  );
};

export default UploadDropzone;
