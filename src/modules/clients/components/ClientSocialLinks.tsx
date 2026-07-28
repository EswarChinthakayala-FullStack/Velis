import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link01Icon } from '@hugeicons/core-free-icons';
import type { SocialLinks } from '../../../types/client';

interface ClientSocialLinksProps {
  socialLinks?: SocialLinks;
}

export const ClientSocialLinks: React.FC<ClientSocialLinksProps> = ({ socialLinks }) => {
  if (!socialLinks) return null;

  const links = [
    { label: 'LinkedIn', url: socialLinks.linkedin },
    { label: 'Twitter / X', url: socialLinks.twitter },
    { label: 'GitHub', url: socialLinks.github },
    { label: 'Portfolio', url: socialLinks.portfolio },
  ].filter((l) => Boolean(l.url));

  if (links.length === 0) return null;

  return (
    <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl space-y-3 select-none">
      <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold pb-2 border-b border-zinc-800/60">
        Online Presence
      </h3>

      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url?.startsWith('http') ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-all"
          >
            <HugeiconsIcon icon={Link01Icon} size={13} className="text-zinc-500" />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ClientSocialLinks;
