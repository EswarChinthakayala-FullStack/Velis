import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRepositoryConnection } from './hooks/useRepositoryConnection';
import { useValidateRepository } from './hooks/useValidateRepository';
import { useLinkRepository } from './hooks/useLinkRepository';
import { useUpdateRepository } from './hooks/useUpdateRepository';
import { useUnlinkRepository } from './hooks/useUnlinkRepository';

import { RepositoryUrlInput } from './components/RepositoryUrlInput';
import { RepositoryPreviewCard } from './components/RepositoryPreviewCard';
import { BranchSelector } from './components/BranchSelector';
import { ConnectionStatus } from './components/ConnectionStatus';
import { RepositoryValidation } from './components/RepositoryValidation';
import { VisibilityBadge } from './components/VisibilityBadge';

import { normalizeGitHubUrl } from './lib/github/normalizers';
import { validateGitHubUrlString } from './lib/github/validators';
import type { GitHubBranchItem, ConnectionStatusState } from './lib/github/types';
import type { GitHubRepoMetadata } from './types/github';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  GitBranchIcon,
  Link01Icon,
  Delete02Icon,
  Tick02Icon,
  AlertCircleIcon,
  Building01Icon,
  Folder01Icon,
} from '@hugeicons/core-free-icons';
import { RadialSpinner } from '../projects/components/RadialSpinner';

interface GitHubLinkFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const GitHubLinkForm: React.FC<GitHubLinkFormProps> = ({
  projectId,
  onSuccess,
  onCancel,
  className = '',
}) => {
  // Existing connection query
  const { data: existingConnection, isLoading: isConnectionLoading } = useRepositoryConnection(projectId);

  // Form State
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('');
  const [branch, setBranch] = useState<string>('main');
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  const [metadata, setMetadata] = useState<GitHubRepoMetadata | null>(null);
  const [branches, setBranches] = useState<GitHubBranchItem[]>([]);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusState>('not_connected');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // React Query Mutations
  const validateMutation = useValidateRepository();
  const linkMutation = useLinkRepository();
  const updateMutation = useUpdateRepository();
  const unlinkMutation = useUnlinkRepository();

  // Populate from existing connection on mount
  useEffect(() => {
    if (existingConnection) {
      setRepoUrl(existingConnection.repo_url);
      setOrganization(existingConnection.organization || '');
      setBranch(existingConnection.branch || 'main');
      setVisibility(existingConnection.visibility || 'private');
      setConnectionStatus('connected');

      // Auto-validate to fetch fresh preview card
      if (existingConnection.repo_url) {
        validateMutation.mutate(existingConnection.repo_url, {
          onSuccess: (res) => {
            if (res.isValid && res.metadata) {
              setMetadata(res.metadata);
              setBranches(res.branches);
              setOrganization(res.metadata.owner.login);
              setRepoName(res.metadata.name);
            }
          },
        });
      }
    }
  }, [existingConnection]);

  // Handle URL Validation Trigger
  const handleValidateUrl = (inputUrl: string) => {
    setUrlError(null);
    setGeneralError(null);

    const normalized = normalizeGitHubUrl(inputUrl);
    setRepoUrl(normalized);

    if (!normalized) {
      setConnectionStatus('not_connected');
      setMetadata(null);
      setBranches([]);
      return;
    }

    const check = validateGitHubUrlString(normalized);
    if (!check.isValid) {
      setUrlError(check.error || 'Invalid GitHub repository URL.');
      setConnectionStatus('error');
      setMetadata(null);
      setBranches([]);
      return;
    }

    setConnectionStatus('validating');
    validateMutation.mutate(normalized, {
      onSuccess: (res) => {
        if (res.isValid && res.metadata) {
          setMetadata(res.metadata);
          setBranches(res.branches);
          setOrganization(res.metadata.owner.login);
          setRepoName(res.metadata.name);
          setBranch(res.metadata.default_branch || 'main');
          setVisibility(res.metadata.private ? 'private' : 'public');
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
          setUrlError(res.error || 'Repository validation failed.');
          setMetadata(null);
          setBranches([]);
        }
      },
      onError: (err) => {
        setConnectionStatus('error');
        setUrlError(err.message || 'Failed to communicate with GitHub API.');
        setMetadata(null);
        setBranches([]);
      },
    });
  };

  // Form Submit Handler (Link / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);
    setGeneralError(null);

    if (!repoUrl) {
      setUrlError('Repository URL is required.');
      return;
    }

    if (connectionStatus === 'validating') return;

    try {
      if (existingConnection) {
        // Update existing repository
        await updateMutation.mutateAsync({
          projectId,
          updates: {
            repoUrl,
            organization,
            branch,
            visibility,
            openIssues: metadata?.open_issues_count ?? 0,
          },
        });
        setSuccessToast('GitHub repository connection updated successfully!');
      } else {
        // Link new repository
        await linkMutation.mutateAsync({
          projectId,
          repoUrl,
          organization,
          branch,
          visibility,
          openIssues: metadata?.open_issues_count ?? 0,
        });
        setSuccessToast('GitHub repository connected successfully!');
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save repository connection.';
      setGeneralError(message);
    }
  };

  // Disconnect Handler
  const handleDisconnect = async () => {
    setGeneralError(null);
    try {
      await unlinkMutation.mutateAsync(projectId);
      setShowDisconnectConfirm(false);
      setRepoUrl('');
      setOrganization('');
      setRepoName('');
      setBranch('main');
      setMetadata(null);
      setBranches([]);
      setConnectionStatus('not_connected');
      setSuccessToast('Repository disconnected successfully.');

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect repository.';
      setGeneralError(message);
    }
  };

  if (isConnectionLoading) {
    return (
      <div className="p-6 rounded-lg bg-zinc-950/80 border border-zinc-800 animate-pulse space-y-4 font-mono text-xs text-zinc-400">
        <div className="h-6 w-48 bg-zinc-800 rounded-lg" />
        <div className="h-10 w-full bg-zinc-900 rounded-lg" />
        <div className="h-24 w-full bg-zinc-900 rounded-lg" />
      </div>
    );
  }

  const isSubmitting = linkMutation.isPending || updateMutation.isPending || unlinkMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 rounded-lg bg-zinc-950/95 border border-zinc-800 shadow-2xl backdrop-blur-2xl space-y-5 text-zinc-100 font-mono select-none ${className}`}
    >
      {/* Header & Connection Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-zinc-800/80">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
              <HugeiconsIcon icon={GitBranchIcon} size={18} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight truncate">
              GitHub Connection
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Connect an enterprise repository to enable real-time commits, releases, and CI monitoring.
          </p>
        </div>

        <div className="self-start sm:self-auto shrink-0">
          <ConnectionStatus status={connectionStatus} errorMessage={urlError} />
        </div>
      </div>

      {/* Success Toast Banner */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-2"
          >
            <HugeiconsIcon icon={Tick02Icon} size={15} />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Error Banner */}
      <AnimatePresence>
        {generalError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold flex items-center gap-2"
          >
            <HugeiconsIcon icon={AlertCircleIcon} size={15} />
            <span>{generalError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repository URL Field */}
      <RepositoryUrlInput
        value={repoUrl}
        onChange={setRepoUrl}
        onBlur={() => handleValidateUrl(repoUrl)}
        error={urlError}
        isDisabled={isSubmitting}
      />

      {/* Validation Feedback & Preview Card */}
      <RepositoryValidation
        isValidating={validateMutation.isPending}
        isValid={connectionStatus === 'connected'}
        errorMessage={urlError}
        normalizedUrl={repoUrl}
      />

      <RepositoryPreviewCard metadata={metadata} isLoading={validateMutation.isPending} />

      {/* Metadata Fields (Organization, Repo Name, Branch, Visibility) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Organization / Owner */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <HugeiconsIcon icon={Building01Icon} size={13} className="text-zinc-500" />
            <span>Owner / Organization</span>
          </label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="e.g. facebook"
            disabled={isSubmitting}
            className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
          />
        </div>

        {/* Repository Name */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <HugeiconsIcon icon={Folder01Icon} size={13} className="text-zinc-500" />
            <span>Repository Name</span>
          </label>
          <input
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="e.g. react"
            disabled={isSubmitting}
            className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
          />
        </div>

        {/* Branch Selector */}
        <BranchSelector
          value={branch}
          onChange={setBranch}
          branches={branches}
          isLoading={validateMutation.isPending}
          isDisabled={isSubmitting}
        />

        {/* Visibility (shadcn/ui Select) */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-zinc-300 flex items-center justify-between">
            <span>Repository Visibility</span>
            <VisibilityBadge visibility={visibility} />
          </label>
          <Select
            value={visibility}
            onValueChange={(val) => {
              if (typeof val === 'string') {
                setVisibility(val as 'public' | 'private');
              }
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full h-9 bg-zinc-950/80 border-zinc-800 rounded-lg text-xs font-mono text-white hover:border-zinc-700 focus:border-zinc-500">
              <SelectValue placeholder="Select visibility..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800 text-white rounded-lg font-mono text-xs">
              <SelectItem value="public" className="font-mono text-xs cursor-pointer">
                Public
              </SelectItem>
              <SelectItem value="private" className="font-mono text-xs cursor-pointer">
                Private
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Disconnect Modal Confirmation Alert */}
      {showDisconnectConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 space-y-3"
        >
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <HugeiconsIcon icon={AlertCircleIcon} size={16} />
            <span>Disconnect GitHub Repository?</span>
          </div>
          <p className="text-[11px] text-rose-300/80 leading-relaxed">
            Are you sure you want to disconnect this repository from the project? This will remove live commit tracking and CI sync for team members.
          </p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowDisconnectConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={unlinkMutation.isPending}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold flex items-center gap-1.5"
            >
              {unlinkMutation.isPending ? (
                <RadialSpinner size={12} className="text-white" />
              ) : (
                <HugeiconsIcon icon={Delete02Icon} size={13} />
              )}
              <span>Disconnect</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Form Action Controls */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-zinc-800/80">
        <div>
          {existingConnection && !showDisconnectConfirm && (
            <button
              type="button"
              onClick={() => setShowDisconnectConfirm(true)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
              <span>Disconnect Repo</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono font-semibold transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || connectionStatus === 'validating'}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RadialSpinner size={14} className="text-black" />
                <span>Saving Connection...</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Link01Icon} size={15} />
                <span>{existingConnection ? 'Save Connection' : 'Connect Repository'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GitHubLinkForm;
