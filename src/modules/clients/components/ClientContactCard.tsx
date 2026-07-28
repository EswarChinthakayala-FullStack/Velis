import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon, CallIcon, Link01Icon, Location01Icon, Clock01Icon } from '@hugeicons/core-free-icons';
import type { ClientRecord } from '../../../types/client';

interface ClientContactCardProps {
  client: ClientRecord;
}

export const ClientContactCard: React.FC<ClientContactCardProps> = ({ client }) => {
  return (
    <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl space-y-4 select-none">
      <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold pb-2 border-b border-zinc-800/60">
        Contact Details & Info
      </h3>

      <div className="space-y-3 text-xs">
        {/* Email */}
        {client.email ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
              <HugeiconsIcon icon={Mail01Icon} size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Email</span>
              <a
                href={`mailto:${client.email}`}
                className="font-medium text-white hover:underline truncate block"
              >
                {client.email}
              </a>
            </div>
          </div>
        ) : null}

        {/* Phone */}
        {client.phone ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
              <HugeiconsIcon icon={CallIcon} size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Phone</span>
              <a
                href={`tel:${client.phone}`}
                className="font-medium text-white hover:underline truncate block"
              >
                {client.phone}
              </a>
            </div>
          </div>
        ) : null}

        {/* Website */}
        {client.website ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
              <HugeiconsIcon icon={Link01Icon} size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Website</span>
              <a
                href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:underline truncate block"
              >
                {client.website}
              </a>
            </div>
          </div>
        ) : null}

        {/* Location */}
        {client.country ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
              <HugeiconsIcon icon={Location01Icon} size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Location</span>
              <span className="font-medium text-white truncate block">{client.country}</span>
            </div>
          </div>
        ) : null}

        {/* Timezone */}
        {client.timezone ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
              <HugeiconsIcon icon={Clock01Icon} size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Timezone</span>
              <span className="font-medium text-white truncate block">{client.timezone}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ClientContactCard;
