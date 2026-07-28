import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deploymentFormSchema, type DeploymentFormValues } from '../schemas/deployment.schema';
import type { DeploymentItem, DeploymentEnvironment, DeploymentStatus, HealthStatus, DeploymentProvider } from '../types/deployment';
import { useCreateDeployment, useUpdateDeployment } from '../lib/supabase/queries/deployments';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, RocketIcon, Tag01Icon } from '@hugeicons/core-free-icons';

interface CreateDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  itemToEdit?: DeploymentItem | null;
}

export const CreateDeploymentModal: React.FC<CreateDeploymentModalProps> = ({
  isOpen,
  onClose,
  projectId,
  itemToEdit,
}) => {
  const createMutation = useCreateDeployment();
  const updateMutation = useUpdateDeployment();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeploymentFormValues>({
    resolver: zodResolver(deploymentFormSchema) as any,
    defaultValues: {
      projectId: projectId || '',
      environment: itemToEdit?.environment || 'production',
      frontendUrl: itemToEdit?.frontendUrl || '',
      backendUrl: itemToEdit?.backendUrl || '',
      apiUrl: itemToEdit?.apiUrl || '',
      adminUrl: itemToEdit?.adminUrl || '',
      portalUrl: itemToEdit?.portalUrl || '',
      version: itemToEdit?.version || 'v1.0.0',
      branch: itemToEdit?.branch || 'main',
      commitSha: itemToEdit?.commitSha || '',
      status: itemToEdit?.status || 'active',
      healthStatus: itemToEdit?.healthStatus || 'healthy',
      provider: itemToEdit?.provider || 'vercel',
      notes: itemToEdit?.notes || '',
    },
  });

  useEffect(() => {
    if (itemToEdit) {
      reset({
        projectId: itemToEdit.projectId,
        environment: itemToEdit.environment,
        frontendUrl: itemToEdit.frontendUrl || '',
        backendUrl: itemToEdit.backendUrl || '',
        apiUrl: itemToEdit.apiUrl || '',
        adminUrl: itemToEdit.adminUrl || '',
        portalUrl: itemToEdit.portalUrl || '',
        version: itemToEdit.version || 'v1.0.0',
        branch: itemToEdit.branch || 'main',
        commitSha: itemToEdit.commitSha || '',
        status: itemToEdit.status || 'active',
        healthStatus: itemToEdit.healthStatus || 'healthy',
        provider: itemToEdit.provider || 'vercel',
        notes: itemToEdit.notes || '',
      });
    } else {
      reset({
        projectId: projectId || '',
        environment: 'production',
        frontendUrl: '',
        backendUrl: '',
        apiUrl: '',
        adminUrl: '',
        portalUrl: '',
        version: 'v1.0.0',
        branch: 'main',
        commitSha: '',
        status: 'active',
        healthStatus: 'healthy',
        provider: 'vercel',
        notes: '',
      });
    }
  }, [itemToEdit, isOpen, projectId, reset]);

  if (!isOpen) return null;

  const onFormSubmit = async (values: DeploymentFormValues) => {
    if (itemToEdit) {
      await updateMutation.mutateAsync({
        id: itemToEdit.id,
        environment: values.environment as DeploymentEnvironment,
        frontendUrl: values.frontendUrl || undefined,
        backendUrl: values.backendUrl || undefined,
        apiUrl: values.apiUrl || undefined,
        adminUrl: values.adminUrl || undefined,
        portalUrl: values.portalUrl || undefined,
        version: values.version || undefined,
        branch: values.branch || undefined,
        commitSha: values.commitSha || undefined,
        status: values.status as DeploymentStatus,
        healthStatus: values.healthStatus as HealthStatus,
        provider: values.provider as DeploymentProvider,
        notes: values.notes || undefined,
      });
    } else {
      await createMutation.mutateAsync({
        projectId,
        environment: values.environment as DeploymentEnvironment,
        frontendUrl: values.frontendUrl || undefined,
        backendUrl: values.backendUrl || undefined,
        apiUrl: values.apiUrl || undefined,
        adminUrl: values.adminUrl || undefined,
        portalUrl: values.portalUrl || undefined,
        version: values.version || undefined,
        branch: values.branch || undefined,
        commitSha: values.commitSha || undefined,
        status: values.status as DeploymentStatus,
        healthStatus: values.healthStatus as HealthStatus,
        provider: values.provider as DeploymentProvider,
        notes: values.notes || undefined,
      });
    }
    onClose();
  };

  const isPending = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-xl rounded-lg bg-[#0c0c0e]/95 border border-zinc-800 p-5 font-mono text-xs space-y-4 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <HugeiconsIcon icon={RocketIcon} size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans tracking-tight">
                {itemToEdit ? 'Edit Deployment Environment' : 'Add Deployment Environment'}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                Configure live application endpoints, health status, and provider metadata.
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
          {/* Row 1: Environment & Provider */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Environment *
              </label>
              <Controller
                name="environment"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-xs font-mono">
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="qa">QA</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="preview">Preview</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Provider
              </label>
              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-xs font-mono">
                      <SelectItem value="vercel">Vercel</SelectItem>
                      <SelectItem value="netlify">Netlify</SelectItem>
                      <SelectItem value="railway">Railway</SelectItem>
                      <SelectItem value="render">Render</SelectItem>
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="fly">Fly.io</SelectItem>
                      <SelectItem value="custom">Custom Server</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Row 2: Public URLs */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Frontend URL
              </label>
              <input
                type="url"
                {...register('frontendUrl')}
                placeholder="https://myproject.com"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
              {errors.frontendUrl && (
                <p className="text-[10px] text-rose-400 font-mono pt-0.5">{errors.frontendUrl.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Client Portal URL
                </label>
                <input
                  type="url"
                  {...register('portalUrl')}
                  placeholder="https://portal.myproject.com"
                  className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  API Endpoint URL
                </label>
                <input
                  type="url"
                  {...register('apiUrl')}
                  placeholder="https://api.myproject.com"
                  className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Admin & Backend Private URLs */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Admin Panel URL</span>
                <span className="text-[9px] text-zinc-500 font-mono">Private</span>
              </label>
              <input
                type="url"
                {...register('adminUrl')}
                placeholder="https://admin.myproject.com"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Backend Private Endpoint</span>
                <span className="text-[9px] text-zinc-500 font-mono">Private</span>
              </label>
              <input
                type="url"
                {...register('backendUrl')}
                placeholder="https://internal-api.myproject.com"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Row 4: Version, Branch, Commit SHA */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Version
              </label>
              <input
                type="text"
                {...register('version')}
                placeholder="v1.0.0"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Branch
              </label>
              <input
                type="text"
                {...register('branch')}
                placeholder="main"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Commit SHA
              </label>
              <input
                type="text"
                {...register('commitSha')}
                placeholder="e.g. 7f3b12a"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Row 5: Status & Health */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Environment Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-xs font-mono">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="deprecated">Deprecated</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Health Status
              </label>
              <Controller
                name="healthStatus"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-xs bg-zinc-900 border-zinc-800 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-xs font-mono">
                      <SelectItem value="healthy">Healthy (Green)</SelectItem>
                      <SelectItem value="warning">Degraded (Yellow)</SelectItem>
                      <SelectItem value="offline">Offline (Red)</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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
              <span>{isPending ? 'Saving...' : itemToEdit ? 'Save Environment' : 'Create Environment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
