import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

interface ClientDrawerHeaderProps {
  mode: 'create' | 'edit';
  onClose: () => void;
}

export const ClientDrawerHeader: React.FC<ClientDrawerHeaderProps> = ({ mode, onClose }) => {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 select-none">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          {mode === 'create' ? 'New Client' : 'Edit Client'}
        </h2>
        <p className="text-xs text-zinc-400 font-mono">
          Manage your client's profile and contact information.
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={18} />
      </button>
    </div>
  );
};

export default ClientDrawerHeader;
