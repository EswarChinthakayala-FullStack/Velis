import React, { useState } from 'react';
import { MarkdownPreview } from './MarkdownPreview';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PencilEdit01Icon,
  Tick02Icon,
  Cancel01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons';
import { RadialSpinner } from './RadialSpinner';

interface ProjectDescriptionCardProps {
  description?: string;
  onSaveDescription: (newDesc: string) => Promise<void>;
}

/**
 * Enterprise Project Description Card
 * Renders description using shared MarkdownPreview with inline editing toggle.
 */
export const ProjectDescriptionCard: React.FC<ProjectDescriptionCardProps> = ({
  description = '',
  onSaveDescription,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(description);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSaveDescription(text);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save description:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setText(description);
    setIsEditing(false);
  };

  return (
    <div className="group relative rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl overflow-hidden transition-all hover:border-zinc-700/80">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/80 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={File01Icon} size={15} className="text-zinc-400" />
          <span>Project Description</span>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setText(description);
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/60 hover:bg-zinc-700 hover:border-zinc-600 text-zinc-200 hover:text-white transition-all cursor-pointer text-xs font-mono shadow-sm"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={13} />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/60 text-zinc-400 hover:text-white transition-all cursor-pointer text-xs font-mono disabled:opacity-50"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={13} />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-all cursor-pointer text-xs font-mono shadow-md disabled:opacity-80"
            >
              {isSaving ? (
                <RadialSpinner size={13} className="text-black shrink-0" />
              ) : (
                <HugeiconsIcon icon={Tick02Icon} size={13} className="shrink-0" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Content / Markdown Preview or Textarea */}
      <div className="p-5">
        {!isEditing ? (
          description && description.trim() ? (
            <MarkdownPreview content={description} />
          ) : (
            <div className="py-8 text-center text-zinc-500 font-mono text-xs italic space-y-2">
              <p>No project description documented yet.</p>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs text-white underline hover:text-zinc-300 cursor-pointer font-sans"
              >
                + Add Description
              </button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Document project architecture, goals, stack overview, and setup steps in GitHub-Class Markdown..."
              rows={8}
              className="w-full p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 text-zinc-100 font-mono text-xs outline-none focus:border-zinc-700 resize-y leading-relaxed custom-scrollbar select-text"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Supports GitHub Flavored Markdown (headings, code blocks, tables)</span>
              <span>{text.length} chars</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDescriptionCard;
