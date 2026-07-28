import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../../../lib/supabase/queries/clients';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserGroupIcon,
  Mail01Icon,
  CallIcon,
  GlobeIcon,
  GitBranchIcon,
  ArrowRight01Icon,
  Building01Icon,
  Location01Icon,
} from '@hugeicons/core-free-icons';

interface ProjectClientCardProps {
  clientId?: string;
  clientName?: string;
  clientCompany?: string;
}

export const ProjectClientCard: React.FC<ProjectClientCardProps> = ({
  clientId,
  clientName,
  clientCompany,
}) => {
  const navigate = useNavigate();
  const { data: client, isLoading } = useClient(clientId);

  const displayName = client?.name || clientName || 'Unassigned Client';
  const displayCompany = client?.company || clientCompany;

  return (
    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={UserGroupIcon} size={15} className="text-zinc-400" />
          <span>Client Profile</span>
        </div>

        {clientId && (
          <button
            type="button"
            onClick={() => navigate(`/app/clients/${clientId}`)}
            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>View Profile</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
          </button>
        )}
      </div>

      {/* Body / Client Info */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-inner">
          {displayName.slice(0, 2).toUpperCase()}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <h4 className="text-sm font-bold text-white truncate">{displayName}</h4>
          {displayCompany && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <HugeiconsIcon icon={Building01Icon} size={13} className="text-zinc-500 shrink-0" />
              <span className="truncate">{displayCompany}</span>
            </div>
          )}

          {client?.country && (
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
              <HugeiconsIcon icon={Location01Icon} size={12} className="text-zinc-600 shrink-0" />
              <span>{client.country}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60 text-xs font-mono">
        {client?.email && (
          <a
            href={`mailto:${client.email}`}
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all truncate"
          >
            <HugeiconsIcon icon={Mail01Icon} size={14} className="text-zinc-500 shrink-0" />
            <span className="truncate">{client.email}</span>
          </a>
        )}

        {client?.phone && (
          <a
            href={`tel:${client.phone}`}
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all truncate"
          >
            <HugeiconsIcon icon={CallIcon} size={14} className="text-zinc-500 shrink-0" />
            <span className="truncate">{client.phone}</span>
          </a>
        )}

        {client?.website && (
          <a
            href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all truncate"
          >
            <HugeiconsIcon icon={GlobeIcon} size={14} className="text-zinc-500 shrink-0" />
            <span className="truncate">Website</span>
          </a>
        )}

        {client?.githubUsername && (
          <a
            href={`https://github.com/${client.githubUsername}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all truncate"
          >
            <HugeiconsIcon icon={GitBranchIcon} size={14} className="text-zinc-500 shrink-0" />
            <span className="truncate">@{client.githubUsername}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectClientCard;
