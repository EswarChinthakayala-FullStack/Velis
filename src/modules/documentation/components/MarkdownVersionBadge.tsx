import React, { useState } from 'react';
import { useDocumentVersions, useRestoreDocumentVersion } from '../../../lib/supabase/queries/documentation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface MarkdownVersionBadgeProps {
  documentId: string;
  currentVersion: string;
  onRestoreVersion?: (content: string, version: string) => void;
}

import { ConfirmDeleteDialog } from '../../../components/ui/confirm-delete-dialog';

interface MarkdownVersionBadgeProps {
  documentId: string;
  currentVersion: string;
  onRestoreVersion?: (content: string, version: string) => void;
}

export const MarkdownVersionBadge: React.FC<MarkdownVersionBadgeProps> = ({
  documentId,
  currentVersion,
  onRestoreVersion,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<any | null>(null);
  const { data: versions = [], isLoading } = useDocumentVersions(documentId);
  const restoreMutation = useRestoreDocumentVersion();

  const handleConfirmRestore = () => {
    if (!versionToRestore) return;
    restoreMutation.mutate(
      {
        documentId,
        versionContent: versionToRestore.content,
        targetVersion: versionToRestore.version,
      },
      {
        onSuccess: () => {
          if (onRestoreVersion) {
            onRestoreVersion(versionToRestore.content, versionToRestore.version);
          }
          setVersionToRestore(null);
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        title="View version history"
      >
        <HugeiconsIcon icon={Clock01Icon} size={13} className="text-zinc-400" />
        <span>v{currentVersion}</span>
      </button>

      {/* Version History Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-lg bg-[#0c0c0e] border border-zinc-800 shadow-2xl p-5 font-mono space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar select-none">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} size={16} className="text-zinc-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Revision History</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={15} />
              </button>
            </div>

            {isLoading ? (
              <div className="text-xs text-zinc-500 py-6 text-center animate-pulse">
                Loading revisions...
              </div>
            ) : versions.length === 0 ? (
              <div className="text-xs text-zinc-500 py-6 text-center">
                No previous document revisions found.
              </div>
            ) : (
              <div className="space-y-2">
                {versions.map((ver) => {
                  const isCurrent = ver.version === currentVersion;

                  return (
                    <div
                      key={ver.id}
                      className={`p-3 rounded-md border flex items-center justify-between gap-3 text-xs transition-colors ${
                        isCurrent
                          ? 'bg-zinc-900 border-zinc-700 text-white'
                          : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span>v{ver.version}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px]">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {new Date(ver.createdAt).toLocaleString()} • {ver.createdBy}
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => setVersionToRestore(ver)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-mono cursor-pointer transition-colors"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Restore Version Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(versionToRestore)}
        onClose={() => setVersionToRestore(null)}
        onConfirm={handleConfirmRestore}
        title="Restore Revision"
        description={`Are you sure you want to restore this document to revision v${versionToRestore?.version || ''}?`}
        confirmText="Restore Revision"
        isLoading={restoreMutation.isPending}
      />
    </>
  );
};

export default MarkdownVersionBadge;
