import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TimelineEntry } from '../lib/types/timeline';
import { getUpdateTypeConfig } from '../lib/utils/timeline-formatters';
import { TimelineAttachmentGrid } from './TimelineAttachmentGrid';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, Calendar01Icon } from '@hugeicons/core-free-icons';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

interface TimelineEntryCardProps {
  entry: TimelineEntry;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  isReadOnly?: boolean;
}

export const TimelineEntryCard: React.FC<TimelineEntryCardProps> = ({
  entry,
  onDelete,
  isDeleting = false,
  isReadOnly = false,
}) => {
  const config = getUpdateTypeConfig(entry.updateType);

  // Clean raw [TYPE:...] prefix from description if present
  const cleanedDescription = entry.description
    ? entry.description.replace(/\[TYPE:[^\]]+\]\s*/g, '').trim()
    : '';

  let formattedDate = 'Recent';
  let relativeTime = '';

  try {
    const parsed = parseISO(entry.entryDate || entry.createdAt);
    formattedDate = format(parsed, 'MMM d, yyyy');
    relativeTime = formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    formattedDate = entry.entryDate || 'Recent';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative pl-6 sm:pl-8 pb-8 group"
    >
      {/* Vertical Timeline Line */}
      <div className="absolute left-[11px] sm:left-[15px] top-6 bottom-0 w-px bg-zinc-800/60 group-last:hidden" />

      {/* Timeline Node Icon */}
      <div
        className={`absolute left-0 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-sm border border-zinc-800/90 bg-zinc-950 flex items-center justify-center shadow-lg text-zinc-300 z-10`}
      >
        <HugeiconsIcon icon={config.icon} size={14} />
      </div>

      {/* Main Card Container */}
      <div className="p-4 sm:p-5 rounded-sm bg-[#0c0c0e] border border-zinc-800/90 hover:border-zinc-700/80 transition-all shadow-xl backdrop-blur-xl space-y-3 font-mono text-xs select-none">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-mono truncate">
                {entry.title}
              </h3>

              {/* Type Badge */}
              <span
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-sm uppercase tracking-wider border flex items-center gap-1 shrink-0 ${config.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                <span>{config.label}</span>
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
              <HugeiconsIcon icon={Calendar01Icon} size={12} />
              <span>{formattedDate}</span>
              {relativeTime && <span className="text-zinc-600">• {relativeTime}</span>}
            </div>
          </div>

          {/* Delete Action Button for Admins */}
          {!isReadOnly && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              disabled={isDeleting}
              className="p-1.5 rounded-sm text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
              title="Delete update"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </button>
          )}
        </div>

        {/* Cleaned Markdown Content Body */}
        {cleanedDescription && (
          <div className="prose prose-invert prose-zinc max-w-none text-xs text-zinc-300 font-sans leading-relaxed pt-1 border-t border-zinc-800/40">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanedDescription}</ReactMarkdown>
          </div>
        )}

        {/* Attachments Grid */}
        {entry.attachments && entry.attachments.length > 0 && (
          <TimelineAttachmentGrid attachments={entry.attachments} />
        )}
      </div>
    </motion.div>
  );
};

export default TimelineEntryCard;
