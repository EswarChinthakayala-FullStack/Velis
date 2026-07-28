import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FolderCodeIcon,
  Search01Icon,
  Add01Icon,
  ViewIcon,
  ViewOffIcon,
  Copy01Icon,
  Download01Icon,
  SecurityCheckIcon
} from '@hugeicons/core-free-icons';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import { GlassInput } from '../ui/GlassInput';
import type { AssetFile } from '../../types';

interface FilesViewProps {
  files: AssetFile[];
}

export const FilesView: React.FC<FilesViewProps> = ({ files }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSecret = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Files & Credentials Vault
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Secure client assets, legal agreements, Figma specs, and environment variables.
          </p>
        </div>
        <GlassButton variant="primary">
          <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" /> Upload Asset
        </GlassButton>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-[20px] bg-zinc-900/40 border border-zinc-800/80">
        <GlassInput
          icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
          placeholder="Search files or credentials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />

        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
          {['all', 'contracts', 'designs', 'api', 'credentials'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFiles.map((file) => (
          <GlassCard key={file.id} hoverEffect className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <GlassBadge variant="zinc" size="sm">
                  {file.category}
                </GlassBadge>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {file.size}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
                  <HugeiconsIcon icon={FolderCodeIcon} size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {file.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    Uploaded {file.uploadedAt}
                  </p>
                </div>
              </div>

              {/* Secret Value Blur / Reveal Box */}
              {file.isSecret && file.secretValue && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={SecurityCheckIcon} size={12} className="text-zinc-400" />
                      Encrypted Value
                    </span>
                    <button
                      onClick={() => toggleSecret(file.id)}
                      className="text-zinc-300 hover:text-white flex items-center gap-1"
                    >
                      {revealedSecrets[file.id] ? (
                        <>
                          <HugeiconsIcon icon={ViewOffIcon} size={12} /> Hide
                        </>
                      ) : (
                        <>
                          <HugeiconsIcon icon={ViewIcon} size={12} /> Reveal
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-zinc-200 truncate select-all">
                    {revealedSecrets[file.id] ? file.secretValue : '••••••••••••••••••••••••••••••••'}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
              {file.isSecret && file.secretValue ? (
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(file.id, file.secretValue!)}
                >
                  <HugeiconsIcon icon={Copy01Icon} size={14} className="mr-1" />
                  {copiedId === file.id ? 'Copied Secret!' : 'Copy String'}
                </GlassButton>
              ) : (
                <GlassButton variant="ghost" size="sm">
                  <HugeiconsIcon icon={Download01Icon} size={14} className="mr-1" /> Download
                </GlassButton>
              )}
              <span className="text-[10px] text-zinc-500 font-mono uppercase">
                {file.type}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
