import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { motion } from 'framer-motion';
import type { DocumentItem } from './lib/types/documentation';
import { useAutosaveDocument } from './hooks/useAutosaveDocument';

import { MarkdownStatus } from './components/MarkdownStatus';
import { MarkdownVersionBadge } from './components/MarkdownVersionBadge';
import { MarkdownWordCounter } from './components/MarkdownWordCounter';
import { MarkdownAttachmentPanel } from './components/MarkdownAttachmentPanel';
import { MarkdownRenderer } from './components/MarkdownRenderer';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ViewIcon,
  Edit01Icon,
  FloppyDiskIcon,
  MaximizeIcon,
  MinimizeIcon,
  BookOpenIcon,
} from '@hugeicons/core-free-icons';

import '@uiw/react-md-editor/markdown-editor.css';

interface MarkdownEditorProps {
  document: DocumentItem;
  onSaveSuccess?: () => void;
  className?: string;
}

export type PreviewMode = 'edit' | 'live' | 'preview';

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  document: doc,
  onSaveSuccess,
  className = '',
}) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('live');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    content,
    setContent,
    saveStatus,
    lastSavedTime,
    currentVersion,
    forceSaveNow,
  } = useAutosaveDocument({
    documentId: doc.id,
    initialContent: doc.content,
    initialVersion: doc.version,
    author: doc.author,
    debounceMs: 1000,
    onSaveSuccess: () => {
      if (onSaveSuccess) onSaveSuccess();
    },
  });

  const handleInsertSnippet = (snippet: string) => {
    setContent(content + snippet);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl bg-[#0a0a0c] border border-zinc-800/80 shadow-2xl flex flex-col font-mono select-none overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50 bg-black' : 'w-full'
      } ${className}`}
    >
      {/* Header Toolbar */}
      <div className="p-3 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between gap-3 flex-wrap text-xs text-zinc-300">
        {/* Left: Document Info & Version */}
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-white tracking-tight truncate max-w-xs sm:max-w-md">
            {doc.title}
          </h2>

          {/* Version Badge & Revision History Modal */}
          <MarkdownVersionBadge
            documentId={doc.id}
            currentVersion={currentVersion}
            onRestoreVersion={(restoredContent) => {
              setContent(restoredContent);
            }}
          />

          {/* Save Status Indicator */}
          <MarkdownStatus status={saveStatus} lastSavedTime={lastSavedTime} />
        </div>

        {/* Right: Controls (View modes, Attachments, Manual Save, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <div className="flex items-center p-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setPreviewMode('edit')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                previewMode === 'edit'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <HugeiconsIcon icon={Edit01Icon} size={12} />
              <span className="hidden sm:inline">Write</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewMode('live')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                previewMode === 'live'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <HugeiconsIcon icon={BookOpenIcon} size={12} />
              <span className="hidden sm:inline">Split</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewMode('preview')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                previewMode === 'preview'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <HugeiconsIcon icon={ViewIcon} size={12} />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          {/* Attachment Manager */}
          <MarkdownAttachmentPanel onInsertMarkdown={handleInsertSnippet} />

          {/* Save Now Button */}
          <button
            type="button"
            onClick={forceSaveNow}
            className="h-8 px-2.5 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center gap-1 hover:bg-zinc-200 transition-colors cursor-pointer shadow"
            title="Save changes immediately"
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={13} />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 px-2 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle fullscreen mode"
          >
            <HugeiconsIcon icon={isFullscreen ? MinimizeIcon : MaximizeIcon} size={14} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-[500px] bg-[#09090b] relative flex">
        {previewMode === 'preview' ? (
          <div className="w-full p-6 overflow-y-auto max-h-[calc(100vh-14rem)] custom-scrollbar">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <div className="w-full flex-1 dark-md-editor">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              preview={previewMode === 'live' ? 'live' : 'edit'}
              height={560}
              hideToolbar={false}
              enableScroll={true}
              components={{
                preview: (source) => <MarkdownRenderer content={source} />,
              }}
              style={{
                backgroundColor: '#09090b',
                color: '#e4e4e7',
                fontFamily: 'monospace',
              }}
            />
          </div>
        )}
      </div>

      {/* Footer Bar with Word Count */}
      <div className="px-4 py-2 bg-zinc-900/90 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <MarkdownWordCounter content={content} />
        <span className="text-[10px] text-zinc-600">Velis Markdown Engine • Autosave Enabled</span>
      </div>
    </motion.div>
  );
};

export default MarkdownEditor;
