import React from 'react';
import type { DateGroup as DateGroupType, ScreenshotItem, GalleryLayoutMode } from '../lib/types/screenshot';
import { ScreenshotGrid } from './ScreenshotGrid';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon } from '@hugeicons/core-free-icons';

interface DateGroupProps {
  dateGroup: DateGroupType;
  layoutMode: GalleryLayoutMode;
  onOpenLightbox: (item: ScreenshotItem) => void;
  onOpenDetails: (item: ScreenshotItem) => void;
  onDownload: (item: ScreenshotItem) => void;
  onDelete?: (item: ScreenshotItem) => void;
  readOnly?: boolean;
}

export const DateGroup: React.FC<DateGroupProps> = ({
  dateGroup,
  layoutMode,
  onOpenLightbox,
  onOpenDetails,
  onDownload,
  onDelete,
  readOnly = false,
}) => {
  return (
    <div className="space-y-2 mb-6">
      {/* Date Header */}
      <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400">
        <HugeiconsIcon icon={Calendar01Icon} size={13} className="text-zinc-500" />
        <span>{dateGroup.dateLabel}</span>
        <span className="text-[10px] text-zinc-600 font-mono">({dateGroup.items.length})</span>
      </div>

      <ScreenshotGrid
        screenshots={dateGroup.items}
        layoutMode={layoutMode}
        onOpenLightbox={onOpenLightbox}
        onOpenDetails={onOpenDetails}
        onDownload={onDownload}
        onDelete={onDelete}
        readOnly={readOnly}
      />
    </div>
  );
};

export default DateGroup;
