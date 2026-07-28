import React, { useState } from 'react';
import type { BatchUploadTask } from '../lib/utils/upload-manager';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Edit01Icon } from '@hugeicons/core-free-icons';

interface UploadMetadataDialogProps {
  task: BatchUploadTask | null;
  onSave: (taskId: string, updates: { title: string; description: string; moduleName: string }) => void;
  onClose: () => void;
}

export const UploadMetadataDialog: React.FC<UploadMetadataDialogProps> = ({
  task,
  onSave,
  onClose,
}) => {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [moduleName, setModuleName] = useState(task.moduleName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(task.id, {
      title: title.trim(),
      description: description.trim(),
      moduleName: moduleName.trim() || 'General',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#0c0c0e] border border-zinc-800 rounded-lg p-6 font-mono text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Edit01Icon} size={16} className="text-zinc-400" />
            <h4 className="text-sm font-bold text-white font-sans">Edit Screenshot Metadata</h4>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-zinc-400 text-[11px]">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 text-[11px]">Module / Feature</label>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 text-[11px]">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white outline-none custom-scrollbar"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-white text-black font-semibold hover:bg-zinc-200"
            >
              Save Metadata
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMetadataDialog;
