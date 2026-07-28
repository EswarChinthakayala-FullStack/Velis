import React, { useState } from 'react';
import { MarkdownPreview } from '../../projects/components/MarkdownPreview';

interface MilestoneMarkdownEditorProps {
  notes: string;
  onChangeNotes: (notes: string) => void;
}

export const MilestoneMarkdownEditor: React.FC<MilestoneMarkdownEditorProps> = ({
  notes,
  onChangeNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <div className="space-y-1.5 font-mono">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300">
          Acceptance Criteria & Notes (Markdown)
        </label>

        <div className="flex items-center p-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-2 py-0.5 rounded-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'write' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2 py-0.5 rounded-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder="Specify deliverables, API endpoints, GFM checklists, or technical requirements..."
          className="w-full p-3 rounded-sm bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 custom-scrollbar resize-none font-mono"
        />
      ) : (
        <div className="p-3 min-h-[120px] max-h-[220px] overflow-y-auto rounded-sm bg-zinc-900/60 border border-zinc-800 text-xs custom-scrollbar">
          {notes ? (
            <MarkdownPreview content={notes} />
          ) : (
            <p className="text-xs text-zinc-600 italic">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MilestoneMarkdownEditor;
