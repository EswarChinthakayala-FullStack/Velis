import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  Mail01Icon,
  CallIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import type { ClientRecord } from '../../../types/client';
import { useDeleteClient } from '../hooks/useDeleteClient';

interface ClientHeaderProps {
  client: ClientRecord;
  onEdit: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ client, onEdit }) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteClient();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      await deleteMutation.mutateAsync(client.id);
      navigate('/app/clients');
    }
  };

  return (
    <div className="flex items-center justify-between gap-2.5 pb-3.5 border-b border-zinc-800/60 select-none w-full">
      {/* Left: Back Button + Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => navigate('/app/clients')}
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0 shadow-sm"
          title="Back to Client Directory"
          aria-label="Back to Client Directory"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        </button>

        <div className="min-w-0 space-y-0.5">
          <h1 className="text-base sm:text-2xl font-bold text-white tracking-tight leading-tight truncate">
            {client.name}
          </h1>
          {client.company && (
            <p className="text-[11px] sm:text-xs text-zinc-400 font-mono truncate">{client.company}</p>
          )}
        </div>
      </div>

      {/* Right: Quick Action Glass Buttons (Strictly Single Row) */}
      <div className="flex items-center gap-1.5 shrink-0">
        {client.email && (
          <button
            onClick={() => handleCopy(client.email!, 'email')}
            className="h-9 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Copy Email Address"
          >
            <HugeiconsIcon
              icon={copiedField === 'email' ? Tick02Icon : Mail01Icon}
              size={15}
              className={copiedField === 'email' ? 'text-emerald-400' : 'text-zinc-400'}
            />
            <span className="hidden sm:inline">{copiedField === 'email' ? 'Copied' : 'Email'}</span>
          </button>
        )}

        {client.phone && (
          <button
            onClick={() => handleCopy(client.phone!, 'phone')}
            className="h-9 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Copy Phone Number"
          >
            <HugeiconsIcon
              icon={copiedField === 'phone' ? Tick02Icon : CallIcon}
              size={15}
              className={copiedField === 'phone' ? 'text-emerald-400' : 'text-zinc-400'}
            />
            <span className="hidden sm:inline">{copiedField === 'phone' ? 'Copied' : 'Call'}</span>
          </button>
        )}

        <button
          onClick={onEdit}
          className="h-9 px-2.5 sm:px-3.5 flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-lg whitespace-nowrap shrink-0"
          title="Edit Client"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={15} />
          <span className="hidden sm:inline">Edit Client</span>
        </button>

        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          title="Delete Client"
        >
          <HugeiconsIcon icon={Delete02Icon} size={15} />
        </button>
      </div>
    </div>
  );
};

export default ClientHeader;
