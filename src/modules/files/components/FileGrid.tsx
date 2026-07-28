import React from 'react';
import type { FileItem } from '../lib/types/file';
import { FileCard } from './FileCard';

interface FileGridProps {
  files: FileItem[];
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
  onMove?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  readOnly?: boolean;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  onPreview,
  onDownload,
  onRename,
  onMove,
  onDelete,
  readOnly = false,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2 select-none">
      <h3 className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider px-1">
        Files ({files.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onPreview={onPreview}
            onDownload={onDownload}
            onRename={onRename}
            onMove={onMove}
            onDelete={onDelete}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
};

export default FileGrid;
