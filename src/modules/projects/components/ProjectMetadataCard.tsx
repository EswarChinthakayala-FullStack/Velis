import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { format, parseISO } from 'date-fns';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectPriorityBadge } from './ProjectPriorityBadge';
import { GitHubLinkForm } from '../../github/github-link-form';
import { useRepositoryConnection } from '../../github/hooks/useRepositoryConnection';
import type { ProjectStatus, ProjectPriority } from '../../../types/project';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  InformationCircleIcon,
  GitBranchIcon,
  PencilEdit01Icon,
  Tick02Icon,
  Cancel01Icon,
  Add01Icon,
} from '@hugeicons/core-free-icons';
import { RadialSpinner } from './RadialSpinner';

interface ProjectMetadataCardProps {
  projectId?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  createdAt: string;
  updatedAt: string;
  githubRepoUrl?: string;
  onUpdateMetadata: (input: { status?: ProjectStatus; priority?: ProjectPriority }) => Promise<void>;
  onConnectRepo?: (repoUrl: string) => Promise<void>;
}

export const ProjectMetadataCard: React.FC<ProjectMetadataCardProps> = ({
  projectId,
  status,
  priority,
  createdAt,
  updatedAt,
  githubRepoUrl,
  onUpdateMetadata,
  onConnectRepo,
}) => {
  const { data: repoConnection } = useRepositoryConnection(projectId);
  const effectiveRepoUrl = githubRepoUrl || repoConnection?.repo_url;

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [isEditingRepo, setIsEditingRepo] = useState(false);
  const [repoInputUrl, setRepoInputUrl] = useState(effectiveRepoUrl || '');
  const [isSavingRepo, setIsSavingRepo] = useState(false);

  const formattedCreated = createdAt ? format(parseISO(createdAt), 'MMM d, yyyy') : 'N/A';
  const formattedUpdated = updatedAt ? format(parseISO(updatedAt), 'MMM d, yyyy HH:mm') : 'N/A';

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    try {
      await onUpdateMetadata({ status: newStatus });
      setIsEditingStatus(false);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handlePriorityChange = async (newPriority: ProjectPriority) => {
    try {
      await onUpdateMetadata({ priority: newPriority });
      setIsEditingPriority(false);
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  const handleSaveRepo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!onConnectRepo || !repoInputUrl.trim()) return;

    try {
      setIsSavingRepo(true);
      await onConnectRepo(repoInputUrl.trim());
      setIsEditingRepo(false);
    } catch (err) {
      console.error('Failed to connect GitHub repository:', err);
    } finally {
      setIsSavingRepo(false);
    }
  };

  return (
    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={InformationCircleIcon} size={15} className="text-zinc-400" />
          <span>Project Metadata</span>
        </div>
      </div>

      {/* Grid Properties */}
      <div className="space-y-3 text-xs font-mono">
        {/* Status */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800">
          <span className="text-zinc-400">Status</span>
          {!isEditingStatus ? (
            <div
              onClick={() => setIsEditingStatus(true)}
              className="flex items-center gap-1.5 cursor-pointer group"
              title="Click to edit status"
            >
              <ProjectStatusBadge status={status} />
              <HugeiconsIcon icon={PencilEdit01Icon} size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
            </div>
          ) : (
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              autoFocus
              onBlur={() => setIsEditingStatus(false)}
              className="bg-zinc-900 border border-zinc-700 text-white font-mono text-xs rounded px-2 py-1 outline-none cursor-pointer"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>

        {/* Priority */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800">
          <span className="text-zinc-400">Priority</span>
          {!isEditingPriority ? (
            <div
              onClick={() => setIsEditingPriority(true)}
              className="flex items-center gap-1.5 cursor-pointer group"
              title="Click to edit priority"
            >
              <ProjectPriorityBadge priority={priority} />
              <HugeiconsIcon icon={PencilEdit01Icon} size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
            </div>
          ) : (
            <select
              value={priority}
              onChange={(e) => handlePriorityChange(e.target.value as ProjectPriority)}
              autoFocus
              onBlur={() => setIsEditingPriority(false)}
              className="bg-zinc-900 border border-zinc-700 text-white font-mono text-xs rounded px-2 py-1 outline-none cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          )}
        </div>

        {/* GitHub Repository */}
        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <HugeiconsIcon icon={GitBranchIcon} size={13} className="text-zinc-500" />
              <span>Repository</span>
            </span>

            {!isEditingRepo ? (
              effectiveRepoUrl ? (
                <div className="flex items-center gap-2">
                  <a
                    href={effectiveRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline truncate max-w-[150px] font-semibold"
                  >
                    Connected
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setRepoInputUrl(effectiveRepoUrl);
                      setIsEditingRepo(true);
                    }}
                    className="text-zinc-500 hover:text-white cursor-pointer"
                    title="Edit Repository URL"
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setRepoInputUrl('');
                    setIsEditingRepo(true);
                  }}
                  className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1 text-[11px] font-sans font-medium"
                >
                  <HugeiconsIcon icon={Add01Icon} size={12} />
                  <span>Connect Repo</span>
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingRepo(false)}
                className="text-zinc-500 hover:text-white cursor-pointer text-[11px]"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Modal / Overlay for Enterprise GitHub Repository Connection Form */}
          {isEditingRepo &&
            createPortal(
              <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none">
                <div className="w-full max-w-2xl my-auto">
                  <GitHubLinkForm
                    projectId={projectId || ''}
                    onSuccess={() => setIsEditingRepo(false)}
                    onCancel={() => setIsEditingRepo(false)}
                  />
                </div>
              </div>,
              document.body
            )}
        </div>

        {/* Created & Updated */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded bg-zinc-950/40 border border-zinc-800/60 space-y-0.5">
            <span className="text-zinc-500 block text-[10px]">Created</span>
            <span className="text-zinc-300 font-semibold">{formattedCreated}</span>
          </div>
          <div className="p-2 rounded bg-zinc-950/40 border border-zinc-800/60 space-y-0.5">
            <span className="text-zinc-500 block text-[10px]">Last Updated</span>
            <span className="text-zinc-300 font-semibold">{formattedUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMetadataCard;
