import React, { useState } from 'react';
import { MarkdownPreview } from '../../projects/components/MarkdownPreview';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit01Icon, ViewIcon } from '@hugeicons/core-free-icons';

interface TaskDrawerDescriptionProps {
  description: string;
  onChangeDescription: (desc: string) => void;
}

export const TaskDrawerDescription: React.FC<TaskDrawerDescriptionProps> = ({
  description,
  onChangeDescription,
}) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="space-y-2 font-mono text-xs select-none">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-zinc-300">Description & Technical Notes</label>
        <button
          type="button"
          onClick={() => setIsPreview((prev) => !prev)}
          className="px-2 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer"
        >
          <HugeiconsIcon icon={isPreview ? Edit01Icon : ViewIcon} size={12} />
          <span>{isPreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>

      {isPreview ? (
        <div className="p-3.5 rounded-sm bg-zinc-900/50 border border-zinc-800 min-h-[160px] max-h-[300px] overflow-y-auto custom-scrollbar">
          {description ? (
            <MarkdownPreview content={description} />
          ) : (
            <p className="text-xs text-zinc-600 italic">No description added yet.</p>
          )}
        </div>
      ) : (
        <textarea
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          rows={7}
          placeholder="Document task requirements, architecture, API endpoints, or acceptance criteria in markdown..."
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500 leading-relaxed resize-none custom-scrollbar"
        />
      )}
    </div>
  );
};

export default TaskDrawerDescription;
