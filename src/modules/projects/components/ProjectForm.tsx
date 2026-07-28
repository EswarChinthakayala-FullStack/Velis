import React from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '../../../lib/validators/project-schema';
import { useClients } from '../../clients/hooks/useClients';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { Slider } from '../../../components/ui/slider';
import { DatePicker } from '../../../components/ui/date-picker';
import { SlugInput } from './SlugInput';
import { DurationPreview } from './DurationPreview';
import { ThumbnailUploader } from './ThumbnailUploader';

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => void;
  formId?: string;
  errorMessage?: string;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  form,
  onSubmit,
  formId = 'project-drawer-form',
  errorMessage,
}) => {
  const { data: clientsData } = useClients({ page: 1, pageSize: 100 });
  const clients = clientsData?.clients || [];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const projectName = watch('name');
  const startDate = watch('startDate');
  const deadline = watch('deadline');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val, { shouldValidate: true, shouldDirty: true });

    // Auto-generate slug if not manually locked
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setValue('slug', generatedSlug, { shouldValidate: true });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto p-6 pb-12 space-y-6 text-xs custom-scrollbar select-none"
    >
      {/* SECTION 1: Basic Information */}
      <div className="space-y-4 pt-1">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60 pb-1.5">
          1. Basic Information
        </h3>

        {/* Project Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-300">
            Project Name <span className="text-rose-400">*</span>
          </label>
          <input
            {...register('name')}
            onChange={handleNameChange}
            placeholder="e.g. NextGen SaaS Platform"
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors"
          />
          {errors.name && (
            <p className="text-[11px] text-rose-400 font-mono pt-0.5">{errors.name.message}</p>
          )}
        </div>

        {/* URL Slug Input */}
        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <SlugInput
              value={field.value || ''}
              onChange={field.onChange}
              error={errors.slug?.message}
            />
          )}
        />
      </div>

      {/* SECTION 2: Client Association */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60 pb-1.5">
          2. Client Association
        </h3>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-300">Assigned Client Account</label>
          <Controller
            name="clientId"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-9 bg-zinc-900/90 border-zinc-800 text-xs">
                  <SelectValue placeholder="Select Client Account..." />
                </SelectTrigger>
                <SelectContent align="start" className="max-h-56">
                  <SelectItem value="">No Client (Internal)</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* SECTION 3: Status & Priority */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60 pb-1.5">
          3. Status & Priority
        </h3>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">Project Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-9 bg-zinc-900/90 border-zinc-800 text-xs">
                    <SelectValue placeholder="Select Status..." />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">Priority Level</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-9 bg-zinc-900/90 border-zinc-800 text-xs">
                    <SelectValue placeholder="Select Priority..." />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Timeline & Duration */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60 pb-1.5">
          4. Timeline & Deliverables
        </h3>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">Start Date</label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick start date..."
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">Deadline</label>
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick deadline..."
                />
              )}
            />
          </div>
        </div>

        {errors.deadline && (
          <p className="text-[11px] text-rose-400 font-mono pt-0.5">{errors.deadline.message}</p>
        )}

        <DurationPreview startDate={startDate} deadline={deadline} />

        {/* Completion Progress % */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-zinc-300">Completion Percent</label>
            <span className="font-mono text-xs font-bold text-white">
              {watch('completionPercent') || 0}%
            </span>
          </div>
          <Controller
            name="completionPercent"
            control={control}
            render={({ field }) => (
              <Slider
                value={field.value || 0}
                onValueChange={field.onChange}
                min={0}
                max={100}
              />
            )}
          />
        </div>
      </div>

      {/* SECTION 5: Branding & Cover */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60 pb-1.5">
          5. Branding & Media
        </h3>

        {/* Color Picker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-300">Accent Theme Color</label>
          <div className="flex items-center gap-2">
            <input
              {...register('color')}
              type="color"
              className="w-9 h-9 rounded bg-transparent border border-zinc-800 cursor-pointer"
            />
            <input
              {...register('color')}
              placeholder="#E11D48"
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white font-mono outline-none"
            />
          </div>
        </div>

        {/* Thumbnail Uploader */}
        <Controller
          name="thumbnailUrl"
          control={control}
          render={({ field }) => (
            <ThumbnailUploader value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {/* SECTION 6: Description & Scope */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60 pb-1.5">
          6. Description & Scope
        </h3>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-300">Description Overview</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Overview of project deliverables, architecture stack, or key scope items..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs mt-2">
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default ProjectForm;
