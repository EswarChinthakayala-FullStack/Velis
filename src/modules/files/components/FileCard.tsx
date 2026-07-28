import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { FileItem } from '../lib/types/file';
import { formatBytes, getCategoryFromMimeOrExt } from '../lib/utils/mime-utils';
import { getFileCategoryIcon } from '../lib/utils/file-icons';
import { getSignedFileUrl } from '../lib/utils/signed-url';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { FileContextMenu } from './FileContextMenu';

interface FileCardProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
  onMove?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  readOnly?: boolean;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  onPreview,
  onDownload,
  onRename,
  onMove,
  onDelete,
  readOnly = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(file.publicUrl || null);

  const category = getCategoryFromMimeOrExt(file.mimeType, file.name);
  const IconComponent = getFileCategoryIcon(category, file.name);

  useEffect(() => {
    let mounted = true;
    if (category === 'image' && file.storagePath && !file.publicUrl) {
      getSignedFileUrl(file.storagePath).then((url) => {
        if (mounted && url) setPreviewUrl(url);
      });
    }
    return () => {
      mounted = false;
    };
  }, [category, file.storagePath, file.publicUrl]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right });
      setIsMenuOpen(true);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setMenuPos(null);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={() => onPreview(file)}
      className="group relative flex flex-col justify-between rounded-lg bg-[#0c0c0e]/80 border border-zinc-800/80 hover:border-zinc-700/80 p-3 shadow-md select-none cursor-pointer"
    >
      {/* Action Menu Trigger Button */}
      <div className="absolute top-2.5 right-2.5 z-20" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleMenuClick}
          className="p-1 rounded-md bg-black/70 backdrop-blur border border-zinc-800 text-zinc-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
          title="More Options"
        >
          <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
        </button>
      </div>

      {/* Floating Unclipped Context Menu Portal */}
      {isMenuOpen && menuPos && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
          />
          <div
            className="fixed z-[9999]"
            style={{
              top: `${menuPos.top}px`,
              left: `${Math.max(16, menuPos.left - 176)}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FileContextMenu
              file={file}
              onPreview={(f) => {
                closeMenu();
                onPreview(f);
              }}
              onDownload={(f) => {
                closeMenu();
                onDownload(f);
              }}
              onRename={(f) => {
                closeMenu();
                if (onRename) onRename(f);
              }}
              onMove={(f) => {
                closeMenu();
                if (onMove) onMove(f);
              }}
              onDelete={(f) => {
                closeMenu();
                if (onDelete) onDelete(f);
              }}
              readOnly={readOnly}
            />
          </div>
        </>
      )}

      {/* Thumbnail or File Category Icon Box */}
      <div className="w-full h-32 rounded-md bg-zinc-950 border border-zinc-800/80 flex items-center justify-center overflow-hidden mb-3 relative">
        {category === 'image' && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="p-3 rounded-lg bg-zinc-800/50 text-zinc-400 group-hover:text-white transition-colors">
            <HugeiconsIcon icon={IconComponent} size={32} />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate font-sans tracking-tight" title={file.name}>
          {file.name}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>{formatBytes(file.size)}</span>
          <span className="uppercase">{category}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;
