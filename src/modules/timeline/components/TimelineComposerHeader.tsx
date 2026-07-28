import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Cancel01Icon,
  ViewIcon,
  Edit01Icon,
  Layout01Icon,
  Maximize01Icon,
  Minimize01Icon,
} from '@hugeicons/core-free-icons';
import { TimelineDraftStatus } from './TimelineDraftStatus';
import type { DraftStatus } from '../hooks/useTimelineDraft';

export type ComposerViewMode = 'split' | 'editor' | 'preview';

interface TimelineComposerHeaderProps {
  draftStatus: DraftStatus;
  viewMode: ComposerViewMode;
  onSetViewMode: (mode: ComposerViewMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export const TimelineComposerHeader: React.FC<TimelineComposerHeaderProps> = ({
  draftStatus,
  viewMode,
  onSetViewMode,
  isFullscreen,
  onToggleFullscreen,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 font-mono select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
          <HugeiconsIcon icon={Add01Icon} size={18} />
        </div>
        <div className="min-w-0 flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            New Timeline Update
          </h2>
          <TimelineDraftStatus status={draftStatus} />
        </div>
      </div>

      {/* View Mode Toggle Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center p-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => onSetViewMode('editor')}
            className={`px-2 py-1 rounded-sm flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Editor Only"
          >
            <HugeiconsIcon icon={Edit01Icon} size={13} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onSetViewMode('split')}
            className={`px-2 py-1 rounded-sm flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'split'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Split Editor & Preview"
          >
            <HugeiconsIcon icon={Layout01Icon} size={13} />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => onSetViewMode('preview')}
            className={`px-2 py-1 rounded-sm flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Live Preview Only"
          >
            <HugeiconsIcon icon={ViewIcon} size={13} />
            <span>Preview</span>
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-sm text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          <HugeiconsIcon icon={isFullscreen ? Minimize01Icon : Maximize01Icon} size={16} />
        </button>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          title="Close Composer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </button>
      </div>
    </div>
  );
};

export default TimelineComposerHeader;
