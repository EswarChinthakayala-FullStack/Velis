import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteFormSchema, type NoteFormValues } from '../schemas/note.schema';
import type { NoteItem, NoteCategory, NoteAttachment } from '../types/note';
import { useCreateNote, useUpdateNote } from '../lib/supabase/queries/notes';
import { useNoteAssets } from '../hooks/useNoteAssets';
import { MarkdownRenderer } from '../../documentation/components/MarkdownRenderer';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  ShieldKeyIcon,
  PencilEdit01Icon,
  ViewIcon,
  Upload01Icon,
  Delete02Icon,
  SparklesIcon,
  PinIcon,
  Tag01Icon,
} from '@hugeicons/core-free-icons';

export interface OptionItem {
  id: string;
  name: string;
}

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: NoteItem | null;
  projectId?: string;
  clientId?: string;
  projects?: OptionItem[];
  clients?: OptionItem[];
}

const NOTE_TEMPLATES: Record<string, string> = {
  meeting: `# 🤝 Meeting Notes
**Date:** ${new Date().toISOString().split('T')[0]}  
**Attendees:** Freelancer, Client  

## 📌 Agenda
1. Milestone deliverables review
2. Technical requirements alignment
3. Payment timeline update

## 📝 Action Items
- [ ] Action item 1
- [ ] Action item 2
`,
  credentials: `# 🔑 Credentials Reference
> [!WARNING]
> Store reference keys and config hints only. Never paste raw secrets.

- **Stripe Dashboard:** Production account configured
- **Supabase Project Ref:** \`pvffyjwwhipkicjvfpql\`
- **Vercel Deployment:** Production branch linked to \`main\`
`,
  architecture: `# 🏗️ Architecture Decision
## Context
Decided to use React Query v5 for client state management.

## Rationale
- Zero client side polling needed
- Automatic cache invalidation on Supabase mutations
`,
};

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  noteToEdit,
  projectId,
  clientId,
  projects = [],
  clients = [],
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [attachments, setAttachments] = useState<NoteAttachment[]>(noteToEdit?.attachments || []);
  const [tagsInput, setTagsInput] = useState<string>(noteToEdit?.tags.join(', ') || '');

  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const { uploadAsset, isUploading } = useNoteAssets();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema) as any,
    defaultValues: {
      title: noteToEdit?.title || '',
      content: noteToEdit?.content || '',
      category: noteToEdit?.category || 'general',
      projectId: noteToEdit?.projectId || projectId || '',
      clientId: noteToEdit?.clientId || clientId || '',
      isPinned: noteToEdit?.isPinned || false,
      isArchived: noteToEdit?.isArchived || false,
      tags: noteToEdit?.tags || [],
      attachments: noteToEdit?.attachments || [],
    },
  });

  useEffect(() => {
    if (noteToEdit) {
      reset({
        title: noteToEdit.title,
        content: noteToEdit.content,
        category: noteToEdit.category,
        projectId: noteToEdit.projectId || '',
        clientId: noteToEdit.clientId || '',
        isPinned: noteToEdit.isPinned,
        isArchived: noteToEdit.isArchived,
        tags: noteToEdit.tags,
        attachments: noteToEdit.attachments || [],
      });
      setAttachments(noteToEdit.attachments || []);
      setTagsInput(noteToEdit.tags.join(', '));
    } else {
      reset({
        title: '',
        content: '',
        category: 'general',
        projectId: projectId || '',
        clientId: clientId || '',
        isPinned: false,
        isArchived: false,
        tags: [],
        attachments: [],
      });
      setAttachments([]);
      setTagsInput('');
    }
  }, [noteToEdit, isOpen, projectId, clientId, reset]);

  if (!isOpen) return null;

  const watchContent = watch('content');
  const watchCategory = watch('category');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploaded = await uploadAsset(file);
        const nextAttachments = [...attachments, uploaded];
        setAttachments(nextAttachments);
        setValue('attachments', nextAttachments);
      } catch (err) {
        console.error('Failed to upload note attachment:', err);
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    const nextAttachments = attachments.filter((a) => a.id !== id);
    setAttachments(nextAttachments);
    setValue('attachments', nextAttachments);
  };

  const onFormSubmit = async (values: NoteFormValues) => {
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (noteToEdit) {
      await updateMutation.mutateAsync({
        id: noteToEdit.id,
        title: values.title,
        content: values.content,
        category: values.category as NoteCategory,
        projectId: values.projectId || undefined,
        clientId: values.clientId || undefined,
        isPinned: values.isPinned,
        isArchived: values.isArchived,
        tags: parsedTags,
        attachments,
      });
    } else {
      await createMutation.mutateAsync({
        title: values.title,
        content: values.content,
        category: values.category as NoteCategory,
        projectId: values.projectId || undefined,
        clientId: values.clientId || undefined,
        isPinned: values.isPinned,
        isArchived: values.isArchived,
        tags: parsedTags,
        attachments,
      });
    }

    onClose();
  };

  const isPending = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-2xl rounded-lg bg-[#0c0c0e]/95 border border-zinc-800 p-5 font-mono text-xs space-y-4 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <HugeiconsIcon icon={ShieldKeyIcon} size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans tracking-tight">
                {noteToEdit ? 'Edit Private Note' : 'Create Private Admin Note'}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                Stored securely. Never accessible to clients or share links.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 font-mono">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Note Title *
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Client Feedback & Architectural Refactoring"
                className={`w-full h-9 px-3 rounded-lg bg-zinc-900 border text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors ${
                  errors.title ? 'border-rose-500/60' : 'border-zinc-800 focus:border-zinc-600'
                }`}
              />
              {errors.title && (
                <p className="text-[10px] text-rose-400 font-mono pt-0.5">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Category
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-xs font-mono">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="meeting">Meeting Notes</SelectItem>
                      <SelectItem value="client_pref">Client Preferences</SelectItem>
                      <SelectItem value="ideas">Ideas</SelectItem>
                      <SelectItem value="bugs">Bugs</SelectItem>
                      <SelectItem value="improvements">Improvements</SelectItem>
                      <SelectItem value="architecture">Architecture</SelectItem>
                      <SelectItem value="deployment">Deployment</SelectItem>
                      <SelectItem value="credentials">Credentials Ref</SelectItem>
                      <SelectItem value="followup">Follow Ups</SelectItem>
                      <SelectItem value="internal_tasks">Internal Tasks</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Row 2: Scope (Project & Client Link) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Link to Project (Optional)
              </label>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || 'none'} onValueChange={(val) => field.onChange(val === 'none' ? '' : val)}>
                    <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                      <SelectValue placeholder="No Project Linked" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-xs font-mono">
                      <SelectItem value="none">Standalone Note (No Project)</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Link to Client (Optional)
              </label>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || 'none'} onValueChange={(val) => field.onChange(val === 'none' ? '' : val)}>
                    <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                      <SelectValue placeholder="No Client Linked" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-xs font-mono">
                      <SelectItem value="none">Standalone Note (No Client)</SelectItem>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Row 3: Markdown Content Tabs & Templates */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'write' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} size={13} />
                  <span>Write Markdown</span>
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

              {NOTE_TEMPLATES[watchCategory] && (
                <button
                  type="button"
                  onClick={() => setValue('content', NOTE_TEMPLATES[watchCategory])}
                  className="text-[10px] text-zinc-400 hover:text-white hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <HugeiconsIcon icon={SparklesIcon} size={11} />
                  <span>Insert {watchCategory.replace('_', ' ')} template</span>
                </button>
              )}
            </div>

            {activeTab === 'write' ? (
              <div className="space-y-1">
                <textarea
                  rows={8}
                  {...register('content')}
                  placeholder="Write private notes using markdown..."
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono leading-relaxed resize-y"
                />
                {errors.content && (
                  <p className="text-[10px] text-rose-400 font-mono pt-0.5">{errors.content.message}</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 min-h-[160px] max-h-[300px] overflow-y-auto custom-scrollbar">
                <MarkdownRenderer content={watchContent || '*No content provided yet.*'} />
              </div>
            )}
          </div>

          {/* Row 4: Tags & Pin Option */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. urgent, v2, security, api"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

            <div className="flex items-end pb-1.5">
              <Controller
                name="isPinned"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-mono">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-white focus:ring-0"
                    />
                    <HugeiconsIcon icon={PinIcon} size={13} className="text-zinc-400" />
                    <span>Pin to top</span>
                  </label>
                )}
              />
            </div>
          </div>

          {/* Row 5: Attachments Upload */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Private Note Attachments
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

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              <HugeiconsIcon icon={Tag01Icon} size={14} />
              <span>{isPending ? 'Saving...' : noteToEdit ? 'Save Note' : 'Create Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
