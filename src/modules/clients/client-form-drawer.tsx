import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientFormSchema, type ClientFormValues } from './schemas/client.schema';
import { useCreateClient } from './hooks/useCreateClient';
import { useUpdateClient } from './hooks/useUpdateClient';
import { ClientDrawerHeader } from './components/ClientDrawerHeader';
import { ClientDrawerFooter } from './components/ClientDrawerFooter';
import { ClientForm } from './components/ClientForm';
import type { ClientRecord } from '../../types/client';

export interface ClientFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  client?: ClientRecord;
}

/**
 * ClientFormDrawer Component (PHASE 06)
 * Enterprise Create & Edit Client Slide-Over Drawer for Velis.
 * 
 * Reusable single drawer component backed 100% by live Supabase mutations.
 * Enforces Zod schema validation, dirty form checks, and responsive 560px glass layout.
 */
export const ClientFormDrawer: React.FC<ClientFormDrawerProps> = ({
  open,
  onOpenChange,
  mode,
  client,
}) => {
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      timezone: '',
      website: '',
      githubUsername: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: '',
        portfolio: '',
      },
      notes: '',
    },
  });

  const { reset, formState } = form;

  // Pre-fill form values in edit mode when client record changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && client) {
        reset({
          name: client.name || '',
          company: client.company || '',
          email: client.email || '',
          phone: client.phone || '',
          country: client.country || '',
          timezone: client.timezone || '',
          website: client.website || '',
          githubUsername: client.githubUsername || '',
          socialLinks: {
            linkedin: client.socialLinks?.linkedin || '',
            twitter: client.socialLinks?.twitter || '',
            github: client.socialLinks?.github || '',
            portfolio: client.socialLinks?.portfolio || '',
          },
          notes: client.notes || '',
        });
      } else {
        reset({
          name: '',
          company: '',
          email: '',
          phone: '',
          country: '',
          timezone: '',
          website: '',
          githubUsername: '',
          socialLinks: {
            linkedin: '',
            twitter: '',
            github: '',
            portfolio: '',
          },
          notes: '',
        });
      }
    }
  }, [open, mode, client, reset]);

  // Handle safe drawer close with dirty form warning
  const handleClose = () => {
    if (formState.isDirty) {
      if (!window.confirm("Discard unsaved changes? Your edits haven't been saved.")) {
        return;
      }
    }
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: ClientFormValues) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(values);
      } else if (mode === 'edit' && client) {
        await updateMutation.mutateAsync({ id: client.id, values });
      }
      reset();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Failed to submit client form:', err);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isError = createMutation.isError || updateMutation.isError;
  const errorMessage =
    createMutation.error?.message || updateMutation.error?.message || 'Submission failed.';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 select-none"
          />

          {/* Slide-Over Drawer Container (560px Desktop / 480px Tablet / 100% Mobile) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-[480px] md:max-w-[560px] bg-[#0E0E10] border-l border-zinc-800 shadow-2xl flex flex-col justify-between text-zinc-100 select-none"
          >
            {/* Header */}
            <ClientDrawerHeader mode={mode} onClose={handleClose} />

            {/* Form Body */}
            <ClientForm form={form} onSubmit={onSubmit}>
              {/* Error Banner */}
              {isError && (
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs mt-2">
                  {errorMessage}
                </div>
              )}
            </ClientForm>

            {/* Footer */}
            <ClientDrawerFooter mode={mode} isSubmitting={isSubmitting} onCancel={handleClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClientFormDrawer;
