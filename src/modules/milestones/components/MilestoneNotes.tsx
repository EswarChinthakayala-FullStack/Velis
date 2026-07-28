import React from 'react';
import { MarkdownPreview } from '../../projects/components/MarkdownPreview';

interface MilestoneNotesProps {
  notes?: string;
}

export const MilestoneNotes: React.FC<MilestoneNotesProps> = ({ notes }) => {
  if (!notes) {
    return (
      <p className="text-xs text-zinc-600 italic font-mono">No milestone notes provided.</p>
    );
  }

  return (
    <div className="p-3 rounded-sm bg-zinc-900/40 border border-zinc-800/60 max-h-[300px] overflow-y-auto custom-scrollbar font-mono text-xs">
      <MarkdownPreview content={notes} />
    </div>
  );
};

export default MilestoneNotes;
