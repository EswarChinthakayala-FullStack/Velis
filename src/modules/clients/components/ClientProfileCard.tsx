import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import type { ClientRecord } from '../../../types/client';

interface ClientProfileCardProps {
  client: ClientRecord;
}

export const ClientProfileCard: React.FC<ClientProfileCardProps> = ({ client }) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const isActive = client.status === 'active';

  return (
    <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-4 min-w-0">
        {/* Initials Avatar */}
        <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-zinc-700/80 flex items-center justify-center text-lg font-bold text-white uppercase tracking-wider shrink-0 shadow-md">
          {getInitials(client.name)}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug truncate">
              {client.name}
            </h2>

            {/* Status Badge - Baseline Centered */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full border whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              <span>{isActive ? 'Active Account' : 'Inactive'}</span>
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-mono truncate">
            {client.company || 'Direct Client'} • Joined {formatTime(client.createdAt)}
          </p>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 shrink-0 border-t sm:border-t-0 sm:border-l border-zinc-800/80 pt-3 sm:pt-0 sm:pl-5">
        {client.country && (
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block uppercase">Location</span>
            <span className="text-white font-medium">{client.country}</span>
          </div>
        )}

        {client.timezone && (
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block uppercase">Timezone</span>
            <span className="text-white font-medium truncate max-w-[140px] block">{client.timezone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfileCard;
