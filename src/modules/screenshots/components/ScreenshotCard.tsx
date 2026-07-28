import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ScreenshotItem } from '../lib/types/screenshot';
import { getSignedScreenshotUrl } from '../lib/utils/signed-url';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { EyeIcon, Download01Icon, Delete02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';

interface ScreenshotCardProps {
  screenshot: ScreenshotItem;
  onOpenLightbox: (item: ScreenshotItem) => void;
  onOpenDetails: (item: ScreenshotItem) => void;
  onDownload: (item: ScreenshotItem) => void;
  onDelete?: (item: ScreenshotItem) => void;
  readOnly?: boolean;
}

export const ScreenshotCard: React.FC<ScreenshotCardProps> = ({
  screenshot,
  onOpenLightbox,
  onOpenDetails,
  onDownload,
  onDelete,
  readOnly = false,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(screenshot.publicUrl || null);

  useEffect(() => {
    let mounted = true;
    if (screenshot.storagePath && !screenshot.publicUrl) {
      getSignedScreenshotUrl(screenshot.storagePath).then((url) => {
        if (mounted && url) setImageUrl(url);
      });
    }
    return () => {
      mounted = false;
    };
  }, [screenshot.storagePath, screenshot.publicUrl]);

  const dateStr = screenshot.takenAt
    ? format(new Date(screenshot.takenAt), 'MMM d, yyyy')
    : 'Recent';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      onClick={() => onOpenLightbox(screenshot)}
      className="group relative flex flex-col justify-between rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 hover:border-zinc-700/80 p-3 shadow-md select-none cursor-pointer overflow-hidden"
    >
      {/* Image Thumbnail Box */}
      <div className="w-full h-44 rounded-md bg-zinc-950 border border-zinc-800/80 flex items-center justify-center overflow-hidden mb-3 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={screenshot.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="animate-pulse w-full h-full bg-zinc-900" />
        )}

        {/* Hover Overlay Controls */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox(screenshot);
            }}
            className="p-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors shadow cursor-pointer"
            title="View Fullscreen"
          >
            <HugeiconsIcon icon={EyeIcon} size={15} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(screenshot);
            }}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Details"
          >
            <HugeiconsIcon icon={InformationCircleIcon} size={15} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(screenshot);
            }}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Download"
          >
            <HugeiconsIcon icon={Download01Icon} size={15} />
          </button>

          {!readOnly && onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(screenshot);
              }}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-700 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Delete"
            >
              <HugeiconsIcon icon={Delete02Icon} size={15} />
            </button>
          )}
        </div>

        {/* Module Badge (Top Left) */}
        {screenshot.moduleName && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 border border-zinc-800 text-[9px] font-mono text-zinc-300 backdrop-blur-md">
            {screenshot.moduleName}
          </span>
        )}
      </div>

      {/* Title & Metadata Details */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-white truncate font-sans tracking-tight" title={screenshot.title}>
          {screenshot.title}
        </h4>
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>{dateStr}</span>
          <span>{screenshot.uploadedBy || 'System Lead'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ScreenshotCard;
