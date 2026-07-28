import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '../lib/schemas/task.schema';
import { useCreateTask } from '../hooks/useCreateTask';
import { useUpdateTask } from '../hooks/useUpdateTask';
import type { TaskItem } from '../lib/types/task';
import { useProjects } from '../../../modules/projects/hooks/useProjects';
import { DatePicker } from '../../../components/ui/date-picker';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { RadialSpinner } from '../../../modules/projects/components/RadialSpinner';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Cancel01Icon, Task01Icon } from '@hugeicons/core-free-icons';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TaskItem | null;
  defaultProjectId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit = null,
  defaultProjectId,
}) => {
  const { data: projectsData } = useProjects();
  const projects = projectsData?.projects || [];

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask(defaultProjectId);

  const isEditing = Boolean(taskToEdit);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      projectId: defaultProjectId || projects[0]?.id || '',
      title: '',
      description: '',
      module: '',
      priority: 'medium' as const,
      status: 'todo' as const,
      dueDate: '',
      progress: 0,
      labels: [],
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      reset({
        projectId: taskToEdit.projectId,
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        module: taskToEdit.module || '',
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        dueDate: taskToEdit.dueDate || '',
        progress: taskToEdit.progress || 0,
        labels: taskToEdit.labels || [],
      });
    } else if (isOpen) {
      reset({
        projectId: defaultProjectId || (projects[0]?.id || ''),
        title: '',
        description: '',
        module: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        progress: 0,
        labels: [],
      });
    }
  }, [taskToEdit, isOpen, defaultProjectId, projects, reset]);

  const onSubmit = async (values: any) => {
    try {
      if (isEditing && taskToEdit) {
        await updateMutation.mutateAsync({
          id: taskToEdit.id,
          payload: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none font-mono text-zinc-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300">
              <HugeiconsIcon icon={Task01Icon} size={18} />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {isEditing ? 'Edit Workspace Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-sm transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Project Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300 text-xs">Linked Project *</label>
            <Controller
              control={control}
              name="projectId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-9 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-white">
                    <SelectValue placeholder="Select project...">
                      {projects.find((p: any) => p.id === field.value)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
                    {projects.map((p: any) => (
                      <SelectItem key={p.id} value={p.id} className="font-mono text-xs rounded-sm">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.projectId && (
              <p className="text-[11px] text-rose-400 font-mono">{errors.projectId?.message as string}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300 text-xs">Task Title *</label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Implement Supabase Row Level Security Policies"
              className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-400 font-mono">{errors.title?.message as string}</p>
            )}
          </div>

          {/* Module & Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Module Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 text-xs">Module / Component</label>
              <input
                type="text"
                {...register('module')}
                placeholder="e.g. Backend, Auth, API, Frontend"
                className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 text-xs">Due Date</label>
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <DatePicker
                    value={field.value || ''}
                    onChange={(val: any) => field.onChange(String(val))}
                    className="w-full h-9 rounded-sm bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                )}
              />
            </div>
          </div>

          {/* Priority & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Priority */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 text-xs">Priority Level</label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-9 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
                      <SelectItem value="urgent" className="font-mono text-xs rounded-sm">Critical</SelectItem>
                      <SelectItem value="high" className="font-mono text-xs rounded-sm">High</SelectItem>
                      <SelectItem value="medium" className="font-mono text-xs rounded-sm">Medium</SelectItem>
                      <SelectItem value="low" className="font-mono text-xs rounded-sm">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 text-xs">Execution Status</label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-9 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
                      <SelectItem value="todo" className="font-mono text-xs rounded-sm">Todo</SelectItem>
                      <SelectItem value="in_progress" className="font-mono text-xs rounded-sm">In Progress</SelectItem>
                      <SelectItem value="review" className="font-mono text-xs rounded-sm">In Review</SelectItem>
                      <SelectItem value="testing" className="font-mono text-xs rounded-sm">Testing</SelectItem>
                      <SelectItem value="completed" className="font-mono text-xs rounded-sm">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300 text-xs">Description / Technical Notes</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Add scope, details, acceptance criteria, or API contracts..."
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500 resize-none"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-semibold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="h-9 px-5 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <RadialSpinner size={14} className="text-black" />
                  <span>{isEditing ? 'Saving...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Add01Icon} size={14} />
                  <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTaskModal;
