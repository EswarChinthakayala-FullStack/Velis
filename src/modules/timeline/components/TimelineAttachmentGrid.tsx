import React, { useState } from 'react';
import type { TimelineAttachment } from '../lib/types/timeline';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  File01Icon,
  Image01Icon,
  Download01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';

interface TimelineAttachmentGridProps {
  attachments: TimelineAttachment[];
}

export const TimelineAttachmentGrid: React.FC<TimelineAttachmentGridProps> = ({ attachments }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-2 pt-2 border-t border-zinc-800/60 font-mono text-xs">
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
        Attachments ({attachments.length})
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {attachments.map((file) => {
          const isImage = file.mimeType?.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.fileName);

          if (isImage) {
            return (
              <div
                key={file.id || file.fileUrl}
                onClick={() => setLightboxImage(file.fileUrl)}
                className="group relative rounded-sm border border-zinc-800 bg-zinc-950 overflow-hidden cursor-pointer h-24 flex items-center justify-center hover:border-zinc-700 transition-colors"
              >
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 font-mono">
                  <HugeiconsIcon icon={Image01Icon} size={16} />
                  <span>Preview</span>
                </div>
              </div>
            );
          }

          return (
            <a
              key={file.id || file.fileUrl}
              href={file.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-sm border border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 hover:border-zinc-700 transition-colors flex items-center justify-between gap-2 group min-w-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white shrink-0">
                  <HugeiconsIcon icon={File01Icon} size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-zinc-200 group-hover:text-white font-medium block truncate">
                    {file.fileName}
                  </span>
                  <span className="text-[10px] text-zinc-500 block uppercase">
                    {file.mimeType ? file.mimeType.split('/')[1] : 'File'}
                  </span>
                </div>
              </div>

              <HugeiconsIcon icon={Download01Icon} size={14} className="text-zinc-500 group-hover:text-white shrink-0" />
            </a>
          );
        })}
      </div>

      {/* Lightbox Modal for Images */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
          <img
            src={lightboxImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-sm border border-zinc-800 object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default TimelineAttachmentGrid;
