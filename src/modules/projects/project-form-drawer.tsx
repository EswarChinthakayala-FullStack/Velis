import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, type ProjectFormValues } from '../../lib/validators/project-schema';
import { useCreateProject } from './hooks/useCreateProject';
import { useUpdateProject } from '../../lib/supabase/queries/projects';
import type { ProjectItem } from '../../types/project';
import { ProjectDrawerHeader } from './components/ProjectDrawerHeader';
import { ProjectDrawerFooter } from './components/ProjectDrawerFooter';
import { ProjectForm } from './components/ProjectForm';

interface ProjectFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  project?: ProjectItem;
}

/**
 * ProjectFormDrawer Component (PHASE 07)
 * Flagship Enterprise Create/Edit Project Slide-Over Drawer for Velis.
 * 
 * Backed 100% by live Supabase mutations and Supabase Storage thumbnail uploads.
 * Zero mock data, zero Base64 image storage, zero hardcoded dropdowns.
 */
export const ProjectFormDrawer: React.FC<ProjectFormDrawerProps> = ({
  open,
  onOpenChange,
  mode = 'create',
  project,
}) => {
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      slug: '',
      clientId: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      deadline: '',
      completionPercent: 0,
      color: '#E11D48',
      thumbnailUrl: '',
    },
  });

  const { reset, formState: { isDirty } } = form;

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && project) {
        reset({
          name: project.name || '',
          slug: project.slug || '',
          clientId: project.clientId || '',
          description: project.description || '',
          status: project.status || 'planning',
          priority: project.priority || 'medium',
          startDate: project.startDate || '',
          deadline: project.deadline || '',
          completionPercent: project.completionPercent || 0,
          color: project.color || '#E11D48',
          thumbnailUrl: project.thumbnailUrl || '',
        });
      } else {
        reset({
          name: '',
          slug: '',
          clientId: '',
          description: '',
          status: 'planning',
          priority: 'medium',
          startDate: '',
          deadline: '',
          completionPercent: 0,
          color: '#E11D48',
          thumbnailUrl: '',
        });
      }
    }
  }, [open, mode, project, reset]);

  // Handle Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isDirty]);

  const handleClose = () => {
    if (isDirty) {
      if (!window.confirm("Discard changes? Your edits haven't been saved.")) {
        return;
      }
    }
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(values);
      } else if (mode === 'edit' && project) {
        await updateMutation.mutateAsync({ id: project.id, values });
      }
      reset();
      onOpenChange(false);
    } catch (err) {
      // Error handled by mutation onError callback
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isError = createMutation.isError || updateMutation.isError;
  const errorMessage =
    createMutation.error?.message || updateMutation.error?.message || undefined;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] select-none"
          />

          {/* Slide-Over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-[9991] w-full sm:max-w-[520px] lg:max-w-[640px] bg-[#0E0E10] border-l border-zinc-800 shadow-2xl flex flex-col justify-between text-zinc-100 select-none"
          >
            {/* Header */}
            <ProjectDrawerHeader mode={mode} onClose={handleClose} />

            {/* Form Content */}
            <ProjectForm
              form={form}
              onSubmit={onSubmit}
              formId="project-drawer-form"
              errorMessage={isError ? errorMessage : undefined}
            />

            {/* Footer */}
            <ProjectDrawerFooter
              mode={mode}
              isSubmitting={isSubmitting}
              onCancel={handleClose}
              formId="project-drawer-form"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectFormDrawer;

