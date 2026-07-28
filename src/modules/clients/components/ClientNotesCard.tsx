import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileCodeIcon } from '@hugeicons/core-free-icons';

interface ClientNotesCardProps {
  notes?: string;
}

export const ClientNotesCard: React.FC<ClientNotesCardProps> = ({ notes }) => {
  return (
    <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl space-y-3 select-none">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/60">
        <HugeiconsIcon icon={FileCodeIcon} size={16} className="text-zinc-400" />
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Notes & Scope Agreements
        </h3>
      </div>

      {notes ? (
        <p className="text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
          {notes}
        </p>
      ) : (
        <p className="text-xs text-zinc-500 font-mono italic py-2">
          No notes or scope agreements recorded for this client account.
        </p>
      )}
    </div>
  );
};

export default ClientNotesCard;
