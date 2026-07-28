import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ScreenshotItem } from '../lib/types/screenshot';
import { formatFileSize } from '../lib/utils/image-utils';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Download01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';

interface ScreenshotMetadataDrawerProps {
  screenshot: ScreenshotItem | null;
  onClose: () => void;
  onDownload: (item: ScreenshotItem) => void;
}

export const ScreenshotMetadataDrawer: React.FC<ScreenshotMetadataDrawerProps> = ({
  screenshot,
  onClose,
  onDownload,
}) => {
  if (!screenshot) return null;

  const dateStr = screenshot.takenAt
    ? format(new Date(screenshot.takenAt), 'MMMM d, yyyy HH:mm')
    : 'Recent';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end select-none">
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md h-full bg-[#0c0c0e] border-l border-zinc-800 shadow-2xl flex flex-col font-mono text-xs overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={InformationCircleIcon} size={18} className="text-zinc-400" />
              <h3 className="font-bold text-white tracking-tight font-sans text-sm">
                Screenshot Details
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            <div className="w-full h-48 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
              <img
                src={screenshot.publicUrl || screenshot.signedUrl || ''}
                alt={screenshot.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-sans">{screenshot.title}</h4>
              {screenshot.description && (
                <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                  {screenshot.description}
                </p>
              )}
            </div>

            <div className="space-y-3 border-t border-zinc-800/80 pt-4">
              <h5 className="font-semibold text-white tracking-tight uppercase text-[11px] text-zinc-400">
                Metadata Specification
              </h5>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">File Size</span>
                  <span className="text-zinc-200 font-semibold">{formatFileSize(screenshot.fileSize)}</span>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Resolution</span>
                  <span className="text-zinc-200 font-semibold">
                    {screenshot.width && screenshot.height ? `${screenshot.width} × ${screenshot.height}` : '1920 × 1080'}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Taken At</span>
                  <span className="text-zinc-200 font-semibold">{dateStr}</span>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Module</span>
                  <span className="text-zinc-200 font-semibold">{screenshot.moduleName || 'General'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => onDownload(screenshot)}
                className="w-full py-2 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 hover:bg-zinc-200 cursor-pointer shadow"
              >
                <HugeiconsIcon icon={Download01Icon} size={14} />
                <span>Download Image</span>
              </button>
            </div>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};

export default ScreenshotMetadataDrawer;
