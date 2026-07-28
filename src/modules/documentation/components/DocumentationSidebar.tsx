import React from 'react';
import type { DocumentItem } from '../lib/types/documentation';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon } from '@hugeicons/core-free-icons';

interface DocumentationSidebarProps {
  documents: DocumentItem[];
  selectedDocumentId?: string;
  onSelectDocument: (doc: DocumentItem) => void;
  readOnly?: boolean;
}

export const DocumentationSidebar: React.FC<DocumentationSidebarProps> = ({
  documents,
  selectedDocumentId,
  onSelectDocument,
}) => {
  // Group documents by category
  const grouped = documents.reduce<Record<string, DocumentItem[]>>((acc, doc) => {
    const cat = doc.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col h-full border-r border-zinc-800/60 bg-[#09090b]/50">
      {/* Header */}
      <div className="px-4 py-3 shrink-0 border-b border-zinc-800/40">
        <span className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
          Document Index
        </span>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 px-2">
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, docs]) => (
            <div key={category} className="space-y-0.5">
              {/* Category Label */}
              <div className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase px-2 py-1.5">
                {category}
              </div>

              {/* Document Items */}
              <div className="space-y-px">
                {docs.map((doc) => {
                  const isSelected = selectedDocumentId === doc.id;

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => onSelectDocument(doc)}
                      className={`group relative w-full text-left rounded-md transition-all duration-150 cursor-pointer text-xs font-sans flex items-center gap-2 py-1.5 pr-2 ${
                        isSelected
                          ? 'bg-zinc-800/80 text-white font-medium pl-3'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 pl-3'
                      }`}
                    >
                      {/* Active Indicator — vertical left border */}
                      <span
                        className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-full transition-all duration-200 ${
                          isSelected
                            ? 'bg-white'
                            : 'bg-transparent group-hover:bg-zinc-600'
                        }`}
                      />

                      <HugeiconsIcon
                        icon={File01Icon}
                        size={13}
                        className={`shrink-0 transition-colors ${
                          isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'
                        }`}
                      />

                      <span className="truncate flex-1">{doc.title}</span>

                      {/* Status chip */}
                      {doc.status && doc.status !== 'approved' && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
                            doc.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : doc.status === 'review'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                          }`}
                        >
                          {doc.status}
                        </span>
                      )}

                      {!doc.isClientVisible && (
                        <span className="text-[10px] text-amber-500/60 shrink-0">🔒</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DocumentationSidebar;
