import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Flag01Icon, Cancel01Icon, CheckmarkCircle02Icon, FolderCheckIcon } from '@hugeicons/core-free-icons';
import type { MilestoneItem } from '../lib/types/milestone';
import { useCreateMilestone, useUpdateMilestone } from '../../../lib/supabase/queries/milestones';
import { useProjects } from '../../projects/hooks/useProjects';
import { RadialSpinner } from '../../projects/components/RadialSpinner';
import { DatePicker } from '../../../components/ui/date-picker';
import { TaskProgressSlider } from '../../tasks/components/TaskProgressSlider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';

interface CreateMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  milestoneToEdit?: MilestoneItem | null;
}

export const CreateMilestoneModal: React.FC<CreateMilestoneModalProps> = ({
  isOpen,
  onClose,
  defaultProjectId,
  milestoneToEdit,
}) => {
  const { data: projectsData } = useProjects();
  const projects = projectsData?.projects || [];

  const [projectId, setProjectId] = useState<string>('');
  const [name, setName] = useState('');
  const [progress, setProgress] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sortOrderStr, setSortOrderStr] = useState<string>('0');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateMilestone();
  const updateMutation = useUpdateMilestone(projectId || defaultProjectId);

  useEffect(() => {
    if (milestoneToEdit) {
      setProjectId(milestoneToEdit.projectId);
      setName(milestoneToEdit.name);
      setProgress(milestoneToEdit.progress);
      setDueDate(milestoneToEdit.dueDate || '');
      setNotes(milestoneToEdit.notes || '');
      setSortOrderStr(String(milestoneToEdit.sortOrder));
    } else {
      setProjectId(defaultProjectId || (projects.length > 0 ? projects[0].id : ''));
      setName('');
      setProgress(0);
      setDueDate('');
      setNotes('');
      setSortOrderStr('0');
    }
    setErrorMessage(null);
  }, [milestoneToEdit, isOpen, defaultProjectId, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Milestone name is required.');
      return;
    }

    const activeProjectId = projectId || defaultProjectId || (projects.length > 0 ? projects[0].id : '');
    if (!activeProjectId) {
      setErrorMessage('Please select a project for this milestone.');
      return;
    }

    const sortOrder = parseInt(sortOrderStr, 10) || 0;

    if (milestoneToEdit) {
      updateMutation.mutate(
        {
          id: milestoneToEdit.id,
          payload: {
            name: name.trim(),
            progress,
            dueDate: dueDate || null,
            notes: notes || undefined,
            sortOrder,
          },
        },
        {
          onSuccess: () => onClose(),
          onError: (err) => setErrorMessage(err.message),
        }
      );
    } else {
      createMutation.mutate(
        {
          projectId: activeProjectId,
          name: name.trim(),
          progress,
          dueDate: dueDate || undefined,
          notes: notes || undefined,
          sortOrder,
        },
        {
          onSuccess: () => onClose(),
          onError: (err) => setErrorMessage(err.message),
        }
      );
    }
  };

  const selectedProject = projects.find((p) => p.id === projectId);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 select-none font-mono">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-lg rounded-sm bg-[#0c0c0e] border border-zinc-800 shadow-2xl overflow-hidden z-10 my-auto"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <HugeiconsIcon icon={Flag01Icon} size={16} />
                </div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  {milestoneToEdit ? 'Edit Milestone' : 'Create New Milestone'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Project Selection Dropdown via shadcn UI */}
              {!defaultProjectId && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <HugeiconsIcon icon={FolderCheckIcon} size={13} className="text-zinc-400" />
                    <span>Project *</span>
                  </label>
                  <Select value={projectId} onValueChange={(val: any) => setProjectId((val as string) || '')}>
                    <SelectTrigger className="w-full h-9 bg-zinc-900 border-zinc-800 text-xs text-white">
                      <SelectValue placeholder="Select a project...">
                        {selectedProject ? selectedProject.name : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm z-[150]">
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="font-mono text-xs text-white cursor-pointer">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Deliverable Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Milestone Deliverable Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Backend Architecture & Auth API Complete"
                  className="w-full h-9 px-3 rounded-sm bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>

              {/* Due Date & Sort Order */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Target Completion Date</label>
                  <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    placeholder="Pick date..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Roadmap Order Position</label>
                  <input
                    type="number"
                    min={0}
                    value={sortOrderStr}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setSortOrderStr(e.target.value)}
                    className="w-full h-9 px-3 rounded-sm bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              {/* shadcn Progress Slider */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Initial Deliverable Progress</label>
                <TaskProgressSlider
                  progress={progress}
                  onChangeProgress={setProgress}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Deliverable Acceptance Notes (Markdown)</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Outline criteria, specs, or release highlights in markdown format..."
                  className="w-full p-3 rounded-sm bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 custom-scrollbar resize-none"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 px-3 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-8 px-4 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RadialSpinner size={12} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                      <span>{milestoneToEdit ? 'Save Changes' : 'Create Milestone'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateMilestoneModal;
