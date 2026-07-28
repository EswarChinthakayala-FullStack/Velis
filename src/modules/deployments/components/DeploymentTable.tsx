import React, { useState } from 'react';
import type { DeploymentItem } from '../types/deployment';
import { HealthStatusBadge, EnvStatusBadge } from './DeploymentStatusBadge';
import { ConfirmDeleteDialog } from '../../../components/ui/confirm-delete-dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Link01Icon,
  Copy01Icon,
  CheckmarkCircle02Icon,
  PencilEdit01Icon,
  Delete02Icon,
  GitBranchIcon,
  GitCommitIcon,
  RocketIcon,
} from '@hugeicons/core-free-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface DeploymentTableProps {
  deployments: DeploymentItem[];
  onEdit?: (item: DeploymentItem) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export const DeploymentTable: React.FC<DeploymentTableProps> = ({
  deployments,
  onEdit,
  onDelete,
  readOnly = false,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const renderUrlPill = (label: string, url?: string, isPrivate: boolean = false) => {
    // SECURITY RULE: Hide private internal URLs from readOnly Client Share Portal viewers
    if (!url || (readOnly && isPrivate)) return <span className="text-zinc-600">—</span>;

    let displayHost = url;
    try {
      displayHost = new URL(url).hostname;
    } catch {
      displayHost = url;
    }

    const isJustCopied = copiedUrl === url;

    return (
      <div className="inline-flex items-center gap-1 max-w-[160px] truncate">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-mono inline-flex items-center gap-1 transition-colors cursor-pointer truncate"
          title={url}
        >
          <HugeiconsIcon icon={Link01Icon} size={11} className="text-zinc-500 shrink-0" />
          <span className="truncate">{label}: {displayHost}</span>
        </a>
        <button
          type="button"
          onClick={() => handleCopy(url)}
          className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Copy URL"
        >
          <HugeiconsIcon icon={isJustCopied ? CheckmarkCircle02Icon : Copy01Icon} size={12} />
        </button>
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 overflow-hidden font-mono select-none shadow-xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3 pl-4">Environment</th>
              <th className="p-3">Health & Status</th>
              <th className="p-3">Live URLs</th>
              <th className="p-3">Version & Commit</th>
              <th className="p-3">Deployed At</th>
              {!readOnly && <th className="p-3 pr-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {deployments.map((item) => {
              let relativeDeploy = item.deployedAt;
              try {
                relativeDeploy = formatDistanceToNow(parseISO(item.deployedAt), { addSuffix: true });
              } catch {
                // Keep raw
              }

              return (
                <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                  {/* Environment Name */}
                  <td className="p-3 pl-4 font-bold text-white font-sans">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={RocketIcon} size={14} className="text-zinc-400" />
                      <span className="capitalize">{item.environment}</span>
                      {item.provider && (
                        <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-500 font-mono uppercase">
                          {item.provider}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Health & Status */}
                  <td className="p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <HealthStatusBadge status={item.healthStatus} />
                      <EnvStatusBadge status={item.status} />
                    </div>
                  </td>

                  {/* Live URLs */}
                  <td className="p-3 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {renderUrlPill('Frontend', item.frontendUrl, false)}
                      {renderUrlPill('Portal', item.portalUrl, false)}
                      {renderUrlPill('API', item.apiUrl, false)}
                      {/* Internal URLs: Hidden from clients */}
                      {!readOnly && renderUrlPill('Admin', item.adminUrl, true)}
                      {!readOnly && renderUrlPill('Backend', item.backendUrl, true)}
                    </div>
                  </td>

                  {/* Version & Branch/Commit */}
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-xs">{item.version || 'v1.0.0'}</div>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        {item.branch && (
                          <span className="inline-flex items-center gap-1">
                            <HugeiconsIcon icon={GitBranchIcon} size={10} />
                            <span>{item.branch}</span>
                          </span>
                        )}
                        {item.commitSha && (
                          <span className="inline-flex items-center gap-1 font-mono">
                            <HugeiconsIcon icon={GitCommitIcon} size={10} />
                            <span>{item.commitSha.substring(0, 7)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Deployed At */}
                  <td className="p-3 text-[11px] text-zinc-400">
                    <div>{relativeDeploy}</div>
                  </td>

                  {/* Actions (Admin Only) */}
                  {!readOnly && (
                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit Environment"
                          >
                            <HugeiconsIcon icon={PencilEdit01Icon} size={13} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(item.id)}
                            className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Environment"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId && onDelete) {
            onDelete(deleteTargetId);
          }
          setDeleteTargetId(null);
        }}
        title="Delete Deployment Environment"
        description="Are you sure you want to remove this deployment environment record? This action cannot be undone."
      />
    </div>
  );
};
