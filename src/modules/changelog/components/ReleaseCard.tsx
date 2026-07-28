import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChangelogEntry } from '../types/changelog';
import { ReleaseMetadata } from './ReleaseMetadata';
import { ReleaseMarkdown } from './ReleaseMarkdown';
import { ReleaseAttachments } from './ReleaseAttachments';
import { parseMarkdownSections } from '../utils/release-formatters';
import { ConfirmDeleteDialog } from '../../../components/ui/confirm-delete-dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  Tag01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';

interface ReleaseCardProps {
  entry: ChangelogEntry;
  readOnly?: boolean;
  onEdit?: (entry: ChangelogEntry) => void;
  onDelete?: (id: string) => void;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({
  entry,
  readOnly = false,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const semanticSections = parseMarkdownSections(entry.description);
  const attachmentCount = entry.attachments?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg bg-[#0c0c0e]/90 border font-mono select-none transition-all shadow-xl ${
        entry.releaseType === 'major'
          ? 'border-purple-500/30'
          : entry.releaseType === 'hotfix'
          ? 'border-rose-500/30'
          : 'border-zinc-800/80 hover:border-zinc-700/90'
      }`}
    >
      {/* Release Header */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Version Tag Pill */}
              <div className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-white font-mono font-bold text-xs inline-flex items-center gap-1.5 shadow-sm">
                <HugeiconsIcon icon={Tag01Icon} size={13} className="text-zinc-400" />
                <span>{entry.version}</span>
              </div>

              <ReleaseMetadata entry={entry} readOnly={readOnly} />
            </div>

            {/* Release Title */}
            <h3 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight leading-snug pt-1">
              {entry.title}
            </h3>

            {/* Short Summary (if exists) */}
            {entry.summary && (
              <p className="text-xs text-zinc-400 font-sans leading-relaxed pt-0.5">
                {entry.summary}
              </p>
            )}
          </div>

          {/* Action Buttons (Edit, Delete, Expand/Collapse) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!readOnly && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(entry)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                title="Edit Release"
              >
                <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
              </button>
            )}

            {!readOnly && onDelete && (
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-900/60 transition-colors cursor-pointer"
                title="Delete Release"
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse Release Notes' : 'Expand Release Notes'}
            >
              <HugeiconsIcon icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon} size={14} />
            </button>
          </div>
        </div>

        {/* Semantic Section Pills summary */}
        {semanticSections.length > 0 && !isExpanded && (
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[10px] text-zinc-500 font-mono">Highlights:</span>
            {semanticSections.map((sec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono flex items-center gap-1"
              >
                <HugeiconsIcon icon={SparklesIcon} size={10} className="text-amber-400" />
                <span>{sec.title}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expandable Content Area */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-zinc-800/80 px-4 sm:px-5 py-4 space-y-4 bg-zinc-950/40"
          >
            {/* Markdown Release Notes */}
            <ReleaseMarkdown content={entry.description} />

            {/* Attached Assets & Files */}
            <ReleaseAttachments attachments={entry.attachments} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          if (onDelete) {
            onDelete(entry.id);
          }
        }}
        title="Delete Release Entry"
        description={`Are you sure you want to delete release version "${entry.version} - ${entry.title}"? This action cannot be undone.`}
        confirmText="Delete Release"
      />
    </motion.div>
  );
};
