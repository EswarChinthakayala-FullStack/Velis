import React from 'react';
import type { MilestoneGroup as MilestoneGroupType, ScreenshotItem, GalleryLayoutMode } from '../lib/types/screenshot';
import { DateGroup } from './DateGroup';
import { HugeiconsIcon } from '@hugeicons/react';
import { Flag01Icon } from '@hugeicons/core-free-icons';

interface MilestoneGroupProps {
  group: MilestoneGroupType;
  layoutMode: GalleryLayoutMode;
  onOpenLightbox: (item: ScreenshotItem) => void;
  onOpenDetails: (item: ScreenshotItem) => void;
  onDownload: (item: ScreenshotItem) => void;
  onDelete?: (item: ScreenshotItem) => void;
  readOnly?: boolean;
}

export const MilestoneGroup: React.FC<MilestoneGroupProps> = ({
  group,
  layoutMode,
  onOpenLightbox,
  onOpenDetails,
  onDownload,
  onDelete,
  readOnly = false,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Milestone Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800/80">
        <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
          <HugeiconsIcon icon={Flag01Icon} size={15} />
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight font-sans">
          {group.milestoneTitle}
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
          {group.totalCount} {group.totalCount === 1 ? 'screenshot' : 'screenshots'}
        </span>
      </div>

      {/* Date Subgroups */}
      <div className="space-y-4 pl-1">
        {group.dateGroups.map((dateGrp) => (
          <DateGroup
            key={dateGrp.dateKey}
            dateGroup={dateGrp}
            layoutMode={layoutMode}
            onOpenLightbox={onOpenLightbox}
            onOpenDetails={onOpenDetails}
            onDownload={onDownload}
            onDelete={onDelete}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
};

export default MilestoneGroup;
