import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { ClientFormValues } from '../schemas/client.schema';

interface SocialLinksEditorProps {
  register: UseFormRegister<ClientFormValues>;
}

export const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({ register }) => {
  return (
    <div className="space-y-3.5 pt-3 border-t border-zinc-800/60">
      <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold pb-1 border-b border-zinc-800/40">
        Online Presence & Social Links
      </h4>

      <div className="grid grid-cols-2 gap-3.5">
        {/* LinkedIn */}
        <div className="space-y-1.5">
          <label className="block text-[11px] text-zinc-400 font-mono pb-0.5">LinkedIn URL</label>
          <input
            {...register('socialLinks.linkedin')}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 outline-none transition-colors"
          />
        </div>

        {/* Twitter / X */}
        <div className="space-y-1.5">
          <label className="block text-[11px] text-zinc-400 font-mono pb-0.5">Twitter / X URL</label>
          <input
            {...register('socialLinks.twitter')}
            placeholder="https://x.com/username"
            className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 outline-none transition-colors"
          />
        </div>

        {/* GitHub */}
        <div className="space-y-1.5">
          <label className="block text-[11px] text-zinc-400 font-mono pb-0.5">GitHub Profile URL</label>
          <input
            {...register('socialLinks.github')}
            placeholder="https://github.com/org"
            className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 outline-none transition-colors"
          />
        </div>

        {/* Portfolio */}
        <div className="space-y-1.5">
          <label className="block text-[11px] text-zinc-400 font-mono pb-0.5">Portfolio URL</label>
          <input
            {...register('socialLinks.portfolio')}
            placeholder="https://portfolio.dev"
            className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialLinksEditor;
