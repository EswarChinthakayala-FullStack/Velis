import React from 'react';
import type { ScreenshotItem, GalleryLayoutMode } from '../lib/types/screenshot';
import { ScreenshotCard } from './ScreenshotCard';

interface ScreenshotGridProps {
  screenshots: ScreenshotItem[];
  layoutMode: GalleryLayoutMode;
  onOpenLightbox: (item: ScreenshotItem) => void;
  onOpenDetails: (item: ScreenshotItem) => void;
  onDownload: (item: ScreenshotItem) => void;
  onDelete?: (item: ScreenshotItem) => void;
  readOnly?: boolean;
}

export const ScreenshotGrid: React.FC<ScreenshotGridProps> = ({
  screenshots,
  layoutMode,
  onOpenLightbox,
  onOpenDetails,
  onDownload,
  onDelete,
  readOnly = false,
}) => {
  if (screenshots.length === 0) return null;

  return (
    <div
      className={
        layoutMode === 'masonry'
          ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3'
          : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
      }
    >
      {screenshots.map((item) => (
        <ScreenshotCard
          key={item.id}
          screenshot={item}
          onOpenLightbox={onOpenLightbox}
          onOpenDetails={onOpenDetails}
          onDownload={onDownload}
          onDelete={onDelete}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default ScreenshotGrid;
