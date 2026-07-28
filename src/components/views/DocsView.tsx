import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FileCodeIcon,
  Search01Icon,
  Add01Icon,
  Share01Icon,
  Edit01Icon,
  Tag01Icon
} from '@hugeicons/core-free-icons';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import { GlassInput } from '../ui/GlassInput';
import type { DocPage } from '../../types';

interface DocsViewProps {
  docs: DocPage[];
}

export const DocsView: React.FC<DocsViewProps> = ({ docs }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const selectedDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  const filteredDocs = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Documentation & Architecture
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Technical specifications, API reference manuals, and client handover docs.
          </p>
        </div>
        <GlassButton variant="primary">
          <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" /> New Document
        </GlassButton>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Doc Sidebar Tree (4 cols) */}
        <GlassCard hoverEffect={false} className="lg:col-span-4 space-y-4">
          <GlassInput
            icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
            placeholder="Search specs or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setIsEditing(false);
                  }}
                  className={`w-full text-left p-3 rounded-[16px] transition-all flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-zinc-800/80 border-white/15 text-white shadow-sm'
                      : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <HugeiconsIcon icon={FileCodeIcon} size={20} className="shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        {doc.category}
                      </span>
                      {doc.isPublic && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                          Shared
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-white truncate mt-1">
                      {doc.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                      Edited {doc.lastEdited}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Right Editor & Viewer Panel (8 cols) */}
        {selectedDoc && (
          <GlassCard hoverEffect={false} className="lg:col-span-8 space-y-6">
            {/* Spec Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/80 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <GlassBadge variant="zinc" size="sm">
                    {selectedDoc.category}
                  </GlassBadge>
                  <span className="text-xs text-zinc-500 font-mono">
                    Author: {selectedDoc.author}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {selectedDoc.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <HugeiconsIcon icon={Edit01Icon} size={14} className="mr-1.5" />
                  {isEditing ? 'Preview' : 'Edit Spec'}
                </GlassButton>
                <GlassButton variant="ghost" size="sm">
                  <HugeiconsIcon icon={Share01Icon} size={14} className="mr-1.5" /> Share Client Link
                </GlassButton>
              </div>
            </div>

            {/* Doc Tag Pills */}
            <div className="flex items-center gap-2 text-xs">
              <HugeiconsIcon icon={Tag01Icon} size={14} className="text-zinc-400" />
              {selectedDoc.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Content View / Editor Body */}
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  defaultValue={selectedDoc.content}
                  className="w-full h-80 bg-zinc-950/80 border border-zinc-800 rounded-[16px] p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
                <div className="flex justify-end gap-2">
                  <GlassButton variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </GlassButton>
                  <GlassButton variant="primary" size="sm" onClick={() => setIsEditing(false)}>
                    Save Changes
                  </GlassButton>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none space-y-4 text-sm text-zinc-300 leading-relaxed font-sans">
                <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-[18px] p-6 space-y-4">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-200 bg-transparent p-0">
                    {selectedDoc.content}
                  </pre>
                </div>
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
