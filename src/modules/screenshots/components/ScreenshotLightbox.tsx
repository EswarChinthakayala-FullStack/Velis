import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ScreenshotItem } from '../lib/types/screenshot';
import { getSignedScreenshotUrl } from '../lib/utils/signed-url';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Download01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ZoomIcon,
} from '@hugeicons/core-free-icons';

interface ScreenshotLightboxProps {
  items: ScreenshotItem[];
  activeId: string | null;
  onClose: () => void;
  onDownload: (item: ScreenshotItem) => void;
}

export const ScreenshotLightbox: React.FC<ScreenshotLightboxProps> = ({
  items,
  activeId,
  onClose,
  onDownload,
}) => {
  const activeIndex = items.findIndex((i) => i.id === activeId);
  const currentItem = activeIndex !== -1 ? items[activeIndex] : null;

  const [imageUrl, setImageUrl] = useState<string | null>(currentItem?.publicUrl || null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    let mounted = true;
    if (currentItem) {
      setZoomLevel(1);
      if (currentItem.storagePath && !currentItem.publicUrl) {
        getSignedScreenshotUrl(currentItem.storagePath).then((url) => {
          if (mounted && url) setImageUrl(url);
        });
      } else {
        setImageUrl(currentItem.publicUrl || null);
      }
    }
    return () => {
      mounted = false;
    };
  }, [currentItem]);

  const handleNext = useCallback(() => {
    if (activeIndex !== -1 && activeIndex < items.length - 1) {
      const nextItem = items[activeIndex + 1];
      setImageUrl(nextItem.publicUrl || null);
    }
  }, [activeIndex, items]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      const prevItem = items[activeIndex - 1];
      setImageUrl(prevItem.publicUrl || null);
    }
  }, [activeIndex, items]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  if (!currentItem) return null;

  const dateStr = currentItem.takenAt
    ? format(new Date(currentItem.takenAt), 'MMMM d, yyyy')
    : 'Recent';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between font-mono select-none">
        {/* Top Controls Bar */}
        <div className="p-4 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white font-sans truncate max-w-sm">
              {currentItem.title}
            </span>
            {currentItem.moduleName && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                {currentItem.moduleName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 mr-2 font-mono">
              {activeIndex + 1} / {items.length}
            </span>

            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
              title="Zoom In"
            >
              <HugeiconsIcon icon={ZoomIcon} size={16} />
            </button>

            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
              title="Zoom Out"
            >
              <HugeiconsIcon icon={ZoomIcon} size={16} />
            </button>

            <button
              type="button"
              onClick={() => onDownload(currentItem)}
              className="h-8 px-3 rounded-md bg-white text-black font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-zinc-200 cursor-pointer shadow"
            >
              <HugeiconsIcon icon={Download01Icon} size={14} />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
          {/* Previous Arrow */}
          {activeIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 z-20 p-3 rounded-full bg-black/60 border border-zinc-800 text-white hover:bg-zinc-900 transition-colors cursor-pointer shadow-2xl"
              title="Previous Screenshot (Left Arrow)"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </button>
          )}

          {/* Screenshot Image */}
          {imageUrl ? (
            <motion.img
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: zoomLevel }}
              transition={{ duration: 0.2 }}
              src={imageUrl}
              alt={currentItem.title}
              className="max-w-full max-h-[75vh] object-contain shadow-2xl rounded-md transition-transform duration-150"
            />
          ) : (
            <div className="animate-pulse w-96 h-64 bg-zinc-900 rounded-md" />
          )}

          {/* Next Arrow */}
          {activeIndex < items.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 z-20 p-3 rounded-full bg-black/60 border border-zinc-800 text-white hover:bg-zinc-900 transition-colors cursor-pointer shadow-2xl"
              title="Next Screenshot (Right Arrow)"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
            </button>
          )}
        </div>

        {/* Bottom Caption Bar */}
        <div className="p-4 bg-zinc-950/90 border-t border-zinc-800/80 text-xs text-zinc-400 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <span className="text-zinc-200 font-semibold font-sans block">{currentItem.title}</span>
            {currentItem.description && (
              <p className="text-[11px] text-zinc-400 font-mono">{currentItem.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500">
            <span>Taken: {dateStr}</span>
            <span>Uploader: {currentItem.uploadedBy || 'System Lead'}</span>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ScreenshotLightbox;
