import React, { useState } from 'react';
import type { NoteItem } from '../types/note';
import { NoteScopeBadge } from './NoteScopeBadge';
import { MarkdownRenderer } from '../../documentation/components/MarkdownRenderer';
import { ConfirmDeleteDialog } from '../../../components/ui/confirm-delete-dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PinIcon,
  ArchiveIcon,
  PencilEdit01Icon,
  Delete02Icon,
  Calendar01Icon,
  AttachmentIcon,
  Tag01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { motion } from 'framer-motion';

interface NoteCardProps {
  note: NoteItem;
  projectName?: string;
  clientName?: string;
  onEdit: (note: NoteItem) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onToggleArchive: (id: string, isArchived: boolean) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  projectName,
  clientName,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  let formattedDate = note.createdAt;
  try {
    const parsed = parseISO(note.createdAt);
    formattedDate = `${format(parsed, 'MMM d, yyyy')} (${formatDistanceToNow(parsed, { addSuffix: true })})`;
  } catch {
    // Keep raw string
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`rounded-lg bg-[#0c0c0e]/90 border font-mono select-none transition-all shadow-xl p-4 sm:p-5 space-y-3 ${
        note.isPinned ? 'border-zinc-700 bg-zinc-950/90' : 'border-zinc-800/80 hover:border-zinc-700/90'
      }`}
    >
      {/* Top Header: Category & Pin / Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Badge */}
          <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
            {note.category.replace('_', ' ')}
          </span>

          {/* Scope Badge */}
          <NoteScopeBadge projectName={projectName} clientName={clientName} />
        </div>

        {/* Action Quick Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTogglePin(note.id, !note.isPinned)}
            className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
              note.isPinned
                ? 'bg-white border-white text-black'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
          >
            <HugeiconsIcon icon={PinIcon} size={13} />
          </button>

          <button
            type="button"
            onClick={() => onToggleArchive(note.id, !note.isArchived)}
            className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
              note.isArchived
                ? 'bg-zinc-800 border-zinc-700 text-amber-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={note.isArchived ? 'Restore Note' : 'Archive Note'}
          >
            <HugeiconsIcon icon={ArchiveIcon} size={13} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(note)}
            className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Edit Note"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
            title="Delete Note"
          >
            <HugeiconsIcon icon={Delete02Icon} size={13} />
          </button>
        </div>
      </div>

      {/* Note Title */}
      <h3 className="text-sm font-bold text-white font-sans tracking-tight leading-snug">
        {note.title}
      </h3>

      {/* Markdown Content */}
      <div className="relative">
        <div
          className={`overflow-hidden transition-all ${
            isExpanded ? 'max-h-none' : 'max-h-36'
          }`}
        >
          <MarkdownRenderer content={note.content} />
        </div>

        {note.content.length > 280 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[10px] text-zinc-400 hover:text-white underline font-mono cursor-pointer transition-colors"
          >
            {isExpanded ? 'Collapse note' : 'Read full note...'}
          </button>
        )}
      </div>

      {/* Tags Chips */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono inline-flex items-center gap-1"
            >
              <HugeiconsIcon icon={Tag01Icon} size={10} className="text-zinc-500" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {/* Attachments List */}
      {note.attachments && note.attachments.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/80 space-y-1">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1">
            <HugeiconsIcon icon={AttachmentIcon} size={11} />
            <span>Attachments ({note.attachments.length})</span>
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {note.attachments.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer truncate max-w-[200px]"
              >
                <HugeiconsIcon icon={Download01Icon} size={12} className="text-zinc-400 shrink-0" />
                <span className="truncate">{file.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Note Footer: Creation Date */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-500 font-mono">
        <span className="inline-flex items-center gap-1">
          <HugeiconsIcon icon={Calendar01Icon} size={11} className="text-zinc-500" />
          <span>{formattedDate}</span>
        </span>
        <span className="text-zinc-600 uppercase">Private Admin Only</span>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(note.id);
          setIsDeleteDialogOpen(false);
        }}
        title="Delete Private Note"
        description="Are you sure you want to permanently delete this private note? This action cannot be undone."
      />
    </motion.div>
  );
};
