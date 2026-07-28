import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

interface ClientEmptyStateProps {
  onNewClient: () => void;
}

export const ClientEmptyState: React.FC<ClientEmptyStateProps> = ({ onNewClient }) => {
  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-4 select-none bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl">
      <svg
        className="w-14 h-14 text-zinc-700 stroke-zinc-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.942 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white tracking-tight">No clients found</h3>
        <p className="text-xs text-zinc-400 max-w-sm">
          Create your first client account to start assigning projects, tracking deliverables, and sharing secure portals.
        </p>
      </div>

      <button
        onClick={onNewClient}
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-lg"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} />
        <span>New Client</span>
      </button>
    </div>
  );
};

export default ClientEmptyState;
