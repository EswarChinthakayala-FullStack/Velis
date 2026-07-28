import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { timelineUpdateSchema, type TimelineUpdateFormValues } from './lib/schemas/timeline-update.schema';

import { useCreateTimelineEntry } from './hooks/useCreateTimelineEntry';
import { useTimelineDraft } from './hooks/useTimelineDraft';
import { useUploadTimelineAttachment } from './hooks/useUploadTimelineAttachment';
import type { TimelineUpdateType, TimelineVisibility, TimelineAttachment } from './lib/types/timeline';

import { TimelineComposerHeader, type ComposerViewMode } from './components/TimelineComposerHeader';
import { TimelineComposerToolbar } from './components/TimelineComposerToolbar';
import { TimelineAttachmentDropzone } from './components/TimelineAttachmentDropzone';
import { TimelineMetadataPanel } from './components/TimelineMetadataPanel';
import { MarkdownPreview } from '../projects/components/MarkdownPreview';
import { RadialSpinner } from '../projects/components/RadialSpinner';

import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, SentIcon, SaveIcon } from '@hugeicons/core-free-icons';

interface UpdateComposerProps {
  projectId: string;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  className?: string;
}

export const UpdateComposer: React.FC<UpdateComposerProps> = ({
  projectId,
  isOpen = true,
  onClose,
  onSuccess,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<ComposerViewMode>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hooks & Mutations
  const createMutation = useCreateTimelineEntry();
  const { draftStatus, setDraftStatus, loadDraft, saveDraft, clearDraft } = useTimelineDraft(projectId);
  const { queue, uploadFiles, removeUploadItem, isUploading } = useUploadTimelineAttachment(projectId);

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TimelineUpdateFormValues>({
    resolver: zodResolver(timelineUpdateSchema),
    defaultValues: {
      title: '',
      description: '',
      entryDate: new Date().toISOString().split('T')[0],
      updateType: 'feature',
      visibility: 'public',
      tags: [],
      attachments: [],
    },
  });

  const formValues = watch();

  // Load existing local draft if available
  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft).length > 0) {
      reset({
        title: draft.title || '',
        description: draft.description || '',
        entryDate: draft.entryDate || new Date().toISOString().split('T')[0],
        updateType: (draft.updateType as TimelineUpdateType) || 'feature',
        visibility: (draft.visibility as TimelineVisibility) || 'public',
        tags: draft.tags || [],
        attachments: draft.attachments || [],
      });
    }
  }, [loadDraft, reset]);

  // Debounced Autosave Draft Trigger
  useEffect(() => {
    if (!formValues.title && !formValues.description) return;
    setDraftStatus('unsaved');
    const timer = setTimeout(() => {
      saveDraft(formValues);
    }, 1200);
    return () => clearTimeout(timer);
  }, [formValues.title, formValues.description, formValues.entryDate, formValues.updateType, formValues.visibility, formValues.tags, formValues.attachments, saveDraft, setDraftStatus]);

  // Markdown Toolbar helper to insert markdown syntax at cursor position
  const handleInsertSyntax = useCallback(
    (prefix: string, suffix: string = '', defaultText: string = '') => {
      const textarea = document.getElementById('composer-markdown-textarea') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = textarea.value;
      const selected = currentText.substring(start, end) || defaultText;

      const replacement = `${prefix}${selected}${suffix}`;
      const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

      setValue('description', newText, { shouldValidate: true, shouldDirty: true });

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 50);
    },
    [setValue]
  );

  // File Upload Handlers
  const handleUploadFiles = async (files: File[]) => {
    const newAttachments = await uploadFiles(files);
    if (newAttachments.length > 0) {
      const current = formValues.attachments || [];
      setValue('attachments', [...current, ...newAttachments], { shouldValidate: true });
    }
  };

  const handleRemoveAttachment = (id: string) => {
    const updated = (formValues.attachments || []).filter((a) => a.id !== id);
    setValue('attachments', updated, { shouldValidate: true });
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(onSubmit)();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDraft(formValues);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setViewMode((prev) => (prev === 'split' ? 'preview' : prev === 'preview' ? 'editor' : 'split'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formValues, handleSubmit, saveDraft]);

  // Submit Handler
  const onSubmit = async (values: any) => {
    setErrorMessage(null);

    try {
      // Encode updateType inside description metadata for Supabase backend queries
      const formattedDescription = `[TYPE:${values.updateType}]\n${(values.description || '').trim()}`;

      await createMutation.mutateAsync({
        projectId,
        title: values.title.trim(),
        description: formattedDescription,
        entryDate: values.entryDate,
        updateType: values.updateType as TimelineUpdateType,
        visibility: values.visibility as TimelineVisibility,
        tags: values.tags || [],
        attachments: (values.attachments || []) as TimelineAttachment[],
      });

      clearDraft();
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish timeline update.';
      setErrorMessage(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none font-mono text-zinc-100 ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`w-full bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col ${
          isFullscreen ? 'h-screen rounded-none' : 'max-w-5xl max-h-[92vh] rounded-sm'
        } ${className}`}
      >
        {/* Top Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 shrink-0">
          <TimelineComposerHeader
            draftStatus={draftStatus}
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
            onClose={() => onClose && onClose()}
          />
        </div>

        {/* Form Body Scrollable Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <HugeiconsIcon icon={AlertCircleIcon} size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-300 text-xs">Update Title *</label>
              <span className="text-[10px] text-zinc-500 font-mono">
                {formValues.title?.length || 0}/120
              </span>
            </div>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Integrated GitHub REST API & Dynamic Branch Synchronization"
              className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-400 font-mono">{errors.title.message}</p>
            )}
          </div>

          {/* Metadata Controls Grid (Date, Category, Visibility, Tags) */}
          <div className="p-3.5 rounded-sm bg-zinc-900/40 border border-zinc-800/80">
            <Controller
              control={control}
              name="entryDate"
              render={({ field }) => (
                <TimelineMetadataPanel
                  entryDate={field.value}
                  onChangeEntryDate={field.onChange}
                  updateType={formValues.updateType}
                  onChangeUpdateType={(val) => setValue('updateType', val)}
                  visibility={formValues.visibility}
                  onChangeVisibility={(val) => setValue('visibility', val)}
                  tags={formValues.tags}
                  onChangeTags={(tags) => setValue('tags', tags)}
                />
              )}
            />
          </div>

          {/* Markdown Toolbar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-300">Description (GitHub GFM Markdown)</label>
              <span className="text-[10px] text-zinc-500">Shortcuts: Ctrl+Enter (Publish) • Ctrl+S (Save)</span>
            </div>
            <TimelineComposerToolbar onInsertSyntax={handleInsertSyntax} />
          </div>

          {/* Editor & Split Preview Viewport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[260px]">
            {/* Markdown Textarea Editor */}
            {(viewMode === 'split' || viewMode === 'editor') && (
              <div className={`space-y-1 ${viewMode === 'editor' ? 'md:col-span-2' : ''}`}>
                <textarea
                  id="composer-markdown-textarea"
                  {...register('description')}
                  rows={10}
                  placeholder="Document progress, engineering decisions, API contracts, deployment logs, or setup steps in GitHub-class markdown..."
                  className="w-full h-full min-h-[260px] p-3 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500 leading-relaxed resize-none custom-scrollbar"
                />
              </div>
            )}

            {/* Split Live Preview Panel */}
            {(viewMode === 'split' || viewMode === 'preview') && (
              <div className={`p-4 rounded-sm bg-zinc-900/50 border border-zinc-800 overflow-y-auto max-h-[400px] min-h-[260px] custom-scrollbar ${viewMode === 'preview' ? 'md:col-span-2' : ''}`}>
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider pb-2 border-b border-zinc-800/60 mb-3">
                  Live Preview
                </div>
                {formValues.description ? (
                  <MarkdownPreview content={formValues.description} />
                ) : (
                  <p className="text-xs text-zinc-600 font-mono italic">
                    Live rendered markdown preview will appear here as you type...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Attachments Drag & Drop Zone */}
          <div className="pt-2 border-t border-zinc-800/80">
            <TimelineAttachmentDropzone
              attachments={formValues.attachments || []}
              uploadQueue={queue}
              onUploadFiles={handleUploadFiles}
              onRemoveAttachment={handleRemoveAttachment}
              onRemoveQueueItem={removeUploadItem}
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={() => saveDraft(formValues)}
              className="h-9 px-4 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HugeiconsIcon icon={SaveIcon} size={14} />
              <span>Save Draft</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onClose && onClose()}
                className="h-9 px-4 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-semibold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createMutation.isPending || isUploading || !formValues.title?.trim()}
                className="h-9 px-5 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <RadialSpinner size={14} className="text-black" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={SentIcon} size={14} />
                    <span>Publish Update</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateComposer;
