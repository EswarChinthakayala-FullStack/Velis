import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { releaseFormSchema, type ReleaseFormValues, SEMVER_REGEX } from './schemas/changelog.schema';
import type { ChangelogEntry, ReleaseType, ReleaseStatus, ChangelogAttachment } from './types/changelog';
import { useCreateChangelogEntry, useUpdateChangelogEntry } from './lib/supabase/queries/changelog';
import { useReleaseAssets } from './hooks/useReleaseAssets';
import { MarkdownRenderer } from '../documentation/components/MarkdownRenderer';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Tag01Icon,
  PencilEdit01Icon,
  ViewIcon,
  Upload01Icon,
  Delete02Icon,
  SparklesIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  RocketIcon,
  Link01Icon,
  Calendar01Icon,
} from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'framer-motion';

export interface ChangelogFormProps {
  projectId: string;
  entryToEdit?: ChangelogEntry | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

const SECTION_TEMPLATES = `# ✨ New Features
- Added feature A

# 🐞 Bug Fixes
- Fixed issue B

# ⚡ Improvements
- Optimized performance

# 🚀 Deployment Notes
- Production build deployed successfully
`;

export const ChangelogForm: React.FC<ChangelogFormProps> = ({
  projectId,
  entryToEdit,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [attachments, setAttachments] = useState<ChangelogAttachment[]>(entryToEdit?.attachments || []);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const createMutation = useCreateChangelogEntry();
  const updateMutation = useUpdateChangelogEntry();
  const { uploadAsset, isUploading } = useReleaseAssets();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReleaseFormValues>({
    resolver: zodResolver(releaseFormSchema) as any,
    defaultValues: {
      version: entryToEdit?.version || '',
      title: entryToEdit?.title || '',
      summary: entryToEdit?.summary || '',
      description: entryToEdit?.description || SECTION_TEMPLATES,
      releasedAt: entryToEdit?.releasedAt ? entryToEdit.releasedAt.split('T')[0] : new Date().toISOString().split('T')[0],
      releaseType: entryToEdit?.releaseType || 'stable',
      status: entryToEdit?.status || 'published',
      githubReleaseUrl: entryToEdit?.githubReleaseUrl || '',
      environment: entryToEdit?.environment || 'production',
      attachments: entryToEdit?.attachments || [],
    },
  });

  const watchVersion = watch('version');
  const watchDescription = watch('description');
  const watchTitle = watch('title');

  const isValidSemver = Boolean(watchVersion && SEMVER_REGEX.test(watchVersion));

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploaded = await uploadAsset(file, projectId);
        const nextAttachments = [...attachments, uploaded];
        setAttachments(nextAttachments);
        setValue('attachments', nextAttachments);
      } catch (err) {
        console.error('Failed to upload asset:', err);
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    const nextAttachments = attachments.filter((a) => a.id !== id);
    setAttachments(nextAttachments);
    setValue('attachments', nextAttachments);
  };

  // Submit Handler
  const onFormSubmit = async (values: ReleaseFormValues, forcedStatus?: ReleaseStatus) => {
    const targetStatus = forcedStatus || values.status;
    setSaveMessage(null);

    try {
      if (entryToEdit) {
        await updateMutation.mutateAsync({
          id: entryToEdit.id,
          version: values.version,
          title: values.title,
          summary: values.summary || undefined,
          description: values.description,
          releasedAt: values.releasedAt ? new Date(values.releasedAt).toISOString() : new Date().toISOString(),
          releaseType: values.releaseType as ReleaseType,
          status: targetStatus,
          githubReleaseUrl: values.githubReleaseUrl || undefined,
          environment: values.environment,
          attachments,
        });
      } else {
        await createMutation.mutateAsync({
          projectId,
          version: values.version,
          title: values.title,
          summary: values.summary || undefined,
          description: values.description,
          releasedAt: values.releasedAt ? new Date(values.releasedAt).toISOString() : new Date().toISOString(),
          releaseType: values.releaseType as ReleaseType,
          status: targetStatus,
          githubReleaseUrl: values.githubReleaseUrl || undefined,
          environment: values.environment,
          attachments,
        });
      }

      setSaveMessage(targetStatus === 'published' ? 'Release Published Successfully!' : 'Draft Saved!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Release Form error:', err);
      setSaveMessage(`Error: ${err?.message || 'Failed to save release'}`);
    }
  };

  // Keyboard Shortcuts (Ctrl + S = Save Draft, Ctrl + Enter = Publish)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSubmit((vals) => onFormSubmit(vals, 'draft'))();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit((vals) => onFormSubmit(vals, 'published'))();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  const isPending = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit((vals) => onFormSubmit(vals))}
      className={`space-y-4 font-mono select-none text-xs ${className}`}
    >
      {/* Toast / Status banner */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
              saveMessage.startsWith('Error')
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-zinc-800 border-zinc-700 text-white'
            }`}
          >
            <HugeiconsIcon
              icon={saveMessage.startsWith('Error') ? AlertCircleIcon : CheckmarkCircle02Icon}
              size={14}
            />
            <span>{saveMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 1: Version Tag & SemVer Validation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Version Tag (SemVer 2.0.0) *
            </label>
            {watchVersion && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono inline-flex items-center gap-1 ${
                  isValidSemver
                    ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isValidSemver ? 'Valid SemVer' : 'Invalid Format'}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              {...register('version')}
              placeholder="e.g. 1.0.0, v2.4.0, 3.0.0-beta.1"
              className={`w-full h-9 px-3 rounded-lg bg-zinc-900 border text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors ${
                errors.version ? 'border-rose-500/60' : 'border-zinc-800 focus:border-zinc-600'
              }`}
            />
          </div>
          {errors.version && (
            <p className="text-[10px] text-rose-400 font-mono pt-0.5">{errors.version.message}</p>
          )}
        </div>

        {/* Release Type Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Release Type
          </label>
          <Controller
            name="releaseType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-xs">
                  <SelectItem value="stable">Stable Release</SelectItem>
                  <SelectItem value="major">Major Release</SelectItem>
                  <SelectItem value="minor">Minor Feature</SelectItem>
                  <SelectItem value="patch">Patch</SelectItem>
                  <SelectItem value="hotfix">Hotfix</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="alpha">Alpha</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Row 2: Title */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Release Title *
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            {watchTitle?.length || 0}/120
          </span>
        </div>
        <input
          type="text"
          {...register('title')}
          placeholder="e.g. Payments Integration & Security Upgrades"
          className={`w-full h-9 px-3 rounded-lg bg-zinc-900 border text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors ${
            errors.title ? 'border-rose-500/60' : 'border-zinc-800 focus:border-zinc-600'
          }`}
        />
        {errors.title && (
          <p className="text-[10px] text-rose-400 font-mono pt-0.5">{errors.title.message}</p>
        )}
      </div>

      {/* Row 3: Short Executive Summary */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          Executive Summary (Optional)
        </label>
        <input
          type="text"
          {...register('summary')}
          placeholder="Brief 1-sentence highlight for client dashboard..."
          className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
        />
      </div>

      {/* Row 4: Markdown Editor & Live Preview Workspace */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          {/* Write / Preview Tab switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'write' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <HugeiconsIcon icon={PencilEdit01Icon} size={13} />
              <span>Write Notes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'preview' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <HugeiconsIcon icon={ViewIcon} size={13} />
              <span>Live Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setValue('description', SECTION_TEMPLATES)}
            className="text-[10px] text-zinc-400 hover:text-white hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HugeiconsIcon icon={SparklesIcon} size={11} />
            <span>Insert Template</span>
          </button>
        </div>

        {/* Tab Body */}
        {activeTab === 'write' ? (
          <div className="space-y-1">
            <textarea
              rows={8}
              {...register('description')}
              placeholder="Write detailed markdown release notes..."
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono leading-relaxed resize-y"
            />
            {errors.description && (
              <p className="text-[10px] text-rose-400 font-mono pt-0.5">
                {errors.description.message}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 min-h-[160px] max-h-[300px] overflow-y-auto custom-scrollbar">
            <MarkdownRenderer content={watchDescription || '*No release notes content provided yet.*'} />
          </div>
        )}
      </div>

      {/* Row 5: Metadata (Date, Status, Environment, GitHub) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Release Date
          </label>
          <input
            type="date"
            {...register('releasedAt')}
            className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Visibility Status
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-xs">
                  <SelectItem value="published">Published (Client Visible)</SelectItem>
                  <SelectItem value="draft">Draft (Admin Only)</SelectItem>
                  <SelectItem value="internal">Internal (Team Only)</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Environment
          </label>
          <input
            type="text"
            {...register('environment')}
            placeholder="production"
            className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            GitHub Release URL
          </label>
          <input
            type="url"
            {...register('githubReleaseUrl')}
            placeholder="https://github.com/..."
            className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      {/* Row 6: Attachments Upload */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Release Attachments & Artifacts
          </label>
          <label className="h-7 px-2.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors">
            <HugeiconsIcon icon={Upload01Icon} size={12} />
            <span>{isUploading ? 'Uploading...' : 'Upload Files'}</span>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {attachments.length > 0 && (
          <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="p-2 rounded bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <span className="truncate max-w-[300px] text-zinc-200">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(file.id)}
                  className="text-zinc-500 hover:text-rose-400 p-0.5 cursor-pointer"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
          Shortcuts: <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">Ctrl+S</kbd> Draft •{' '}
          <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">Ctrl+Enter</kbd> Publish
        </span>

        <div className="flex items-center gap-2 ml-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-9 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit((vals) => onFormSubmit(vals, 'draft'))}
            disabled={isPending}
            className="h-9 px-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-medium text-xs cursor-pointer transition-colors"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            <HugeiconsIcon icon={Tag01Icon} size={14} />
            <span>{isPending ? 'Publishing...' : entryToEdit ? 'Save Release' : 'Publish Release'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
