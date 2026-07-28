import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { MilestoneItem, MilestoneAttachmentItem } from './lib/types/milestone';
import { milestoneFormSchema } from './lib/schemas/milestone.schema';
import {
  useCreateMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
  createMilestoneAttachmentRecord,
  deleteMilestoneAttachmentRecord,
} from '../../lib/supabase/queries/milestones';
import { uploadMilestoneAttachmentFile, deleteMilestoneAttachmentFile } from './lib/storage/milestone-attachments';

import { MilestoneFormHeader } from './components/MilestoneFormHeader';
import { MilestoneBasicInfo } from './components/MilestoneBasicInfo';
import { MilestoneDueDatePicker } from './components/MilestoneDueDatePicker';
import { MilestoneMarkdownEditor } from './components/MilestoneMarkdownEditor';
import { MilestoneAttachmentUploader } from './components/MilestoneAttachmentUploader';
import { MilestoneAttachmentList } from './components/MilestoneAttachmentList';
import { MilestoneFormFooter } from './components/MilestoneFormFooter';
import { ConfirmDeleteDialog } from '../../components/ui/confirm-delete-dialog';
import { TaskProgressSlider } from '../tasks/components/TaskProgressSlider';
import { useQueryClient } from '@tanstack/react-query';

interface MilestoneFormProps {
  projectId?: string;
  milestoneToEdit?: MilestoneItem | null;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
}

export const MilestoneForm: React.FC<MilestoneFormProps> = ({
  projectId,
  milestoneToEdit,
  onClose,
  onSuccess,
  className = '',
}) => {
  const isEditMode = Boolean(milestoneToEdit);
  const targetProjectId = projectId || milestoneToEdit?.projectId;
  const queryClient = useQueryClient();

  // Form Field States
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<MilestoneAttachmentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Mutations
  const createMutation = useCreateMilestone();
  const updateMutation = useUpdateMilestone(targetProjectId);
  const deleteMutation = useDeleteMilestone(targetProjectId);

  // Populate data in Edit Mode
  useEffect(() => {
    if (milestoneToEdit) {
      setName(milestoneToEdit.name);
      setDueDate(milestoneToEdit.dueDate || '');
      setProgress(milestoneToEdit.progress);
      setNotes(milestoneToEdit.notes || '');
      setAttachments(milestoneToEdit.attachments || []);
    } else {
      setName('');
      setDueDate('');
      setProgress(0);
      setNotes('');
      setAttachments([]);
    }
    setValidationError(null);
  }, [milestoneToEdit]);

  // Handle File Upload to Supabase Storage
  const handleUploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);

    try {
      const activeMilestoneId = milestoneToEdit?.id || 'temp-upload';

      for (const file of files) {
        const { fileName, fileUrl } = await uploadMilestoneAttachmentFile(activeMilestoneId, file);

        if (milestoneToEdit?.id) {
          const newRecord = await createMilestoneAttachmentRecord(
            milestoneToEdit.id,
            fileName,
            fileUrl
          );
          setAttachments((prev) => [...prev, newRecord]);
        } else {
          // Local staging for new milestone before save
          setAttachments((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              milestoneId: 'temp',
              fileName,
              fileUrl,
            },
          ]);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    } catch (err: any) {
      setValidationError(err.message || 'Failed to upload attachment.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Attachment Deletion
  const handleDeleteAttachment = async (file: MilestoneAttachmentItem) => {
    try {
      await deleteMilestoneAttachmentFile(file.fileUrl);
      if (milestoneToEdit?.id && file.id && !file.id.startsWith('temp')) {
        await deleteMilestoneAttachmentRecord(file.id);
      }
      setAttachments((prev) => prev.filter((a) => a.id !== file.id));
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    } catch {
      setAttachments((prev) => prev.filter((a) => a.id !== file.id));
    }
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Zod Validation
    const validationResult = milestoneFormSchema.safeParse({
      name,
      progress,
      notes,
      dueDate,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid milestone data.';
      setValidationError(firstError);
      return;
    }

    if (!targetProjectId) {
      setValidationError('Project selection is required.');
      return;
    }

    if (isEditMode && milestoneToEdit) {
      updateMutation.mutate(
        {
          id: milestoneToEdit.id,
          payload: {
            name: name.trim(),
            dueDate: dueDate || null,
            progress,
            notes: notes || undefined,
          },
        },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
            onClose();
          },
          onError: (err) => setValidationError(err.message),
        }
      );
    } else {
      createMutation.mutate(
        {
          projectId: targetProjectId,
          name: name.trim(),
          dueDate: dueDate || undefined,
          progress,
          notes: notes || undefined,
        },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
            onClose();
          },
          onError: (err) => setValidationError(err.message),
        }
      );
    }
  };

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);

  const handleDeleteMilestone = () => {
    if (!milestoneToEdit) return;
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteMilestone = () => {
    if (!milestoneToEdit) return;
    deleteMutation.mutate(milestoneToEdit.id, {
      onSuccess: () => {
        setIsConfirmDeleteDialogOpen(false);
        if (onSuccess) onSuccess();
        onClose();
      },
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-sm bg-[#0c0c0e] border border-zinc-800 shadow-2xl overflow-hidden font-mono select-none ${className}`}
    >
      {/* Header */}
      <MilestoneFormHeader isEditMode={isEditMode} onClose={onClose} />

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
        {validationError && (
          <div className="p-3 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {validationError}
          </div>
        )}

        {/* Section 1: Basic Information */}
        <MilestoneBasicInfo name={name} onChangeName={setName} />

        {/* Section 2: Target Due Date */}
        <MilestoneDueDatePicker dueDate={dueDate} onChangeDueDate={setDueDate} />

        {/* Deliverable Progress Slider */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">Deliverable Progress</label>
          <TaskProgressSlider
            progress={progress}
            onChangeProgress={setProgress}
          />
        </div>

        {/* Section 3: Acceptance Criteria & Markdown Notes */}
        <MilestoneMarkdownEditor notes={notes} onChangeNotes={setNotes} />

        {/* Section 4: Attachments & Assets */}
        <MilestoneAttachmentUploader
          isUploading={isUploading}
          onUploadFiles={handleUploadFiles}
        />

        <MilestoneAttachmentList
          attachments={attachments}
          onDeleteAttachment={handleDeleteAttachment}
        />

        {/* Footer Actions */}
        <MilestoneFormFooter
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          onCancel={onClose}
          onDelete={isEditMode ? handleDeleteMilestone : undefined}
        />
      </form>

      <ConfirmDeleteDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDeleteMilestone}
        title="Delete Milestone"
        description={`Are you sure you want to delete milestone "${milestoneToEdit?.name || ''}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
};

export default MilestoneForm;
