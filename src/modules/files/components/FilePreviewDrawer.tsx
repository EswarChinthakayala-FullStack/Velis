import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FileItem } from '../lib/types/file';
import { getCategoryFromMimeOrExt, formatBytes } from '../lib/utils/mime-utils';
import { getSignedFileUrl } from '../lib/utils/signed-url';
import { MarkdownRenderer } from '../../documentation/components/MarkdownRenderer';
import { MarkdownCodeBlock } from '../../documentation/components/MarkdownCodeBlock';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Download01Icon,
  Copy01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons';

interface FilePreviewDrawerProps {
  file: FileItem | null;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
}

export const FilePreviewDrawer: React.FC<FilePreviewDrawerProps> = ({
  file,
  onClose,
  onDownload,
}) => {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(file?.publicUrl || null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const category = file ? getCategoryFromMimeOrExt(file.mimeType, file.name) : 'other';

  useEffect(() => {
    let isMounted = true;
    if (!file) return;

    // Get signed URL if public URL is missing
    if (file.storagePath && !file.publicUrl) {
      getSignedFileUrl(file.storagePath).then((url) => {
        if (isMounted && url) setResolvedUrl(url);
      });
    } else {
      setResolvedUrl(file.publicUrl || null);
    }

    // Fetch text content for code/markdown files
    if (category === 'code' || category === 'document') {
      setIsLoadingContent(true);
      const targetUrl = file.publicUrl || file.storagePath;
      if (targetUrl) {
        getSignedFileUrl(targetUrl)
          .then((url) => fetch(url))
          .then((res) => res.text())
          .then((text) => {
            if (isMounted) setTextContent(text);
          })
          .catch(() => {
            if (isMounted) setTextContent('Unable to preview text content directly.');
          })
          .finally(() => {
            if (isMounted) setIsLoadingContent(false);
          });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [file, category]);

  if (!file) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end select-none">
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-2xl h-full bg-[#0c0c0e] border-l border-zinc-800 shadow-2xl flex flex-col font-mono text-xs overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <HugeiconsIcon icon={File01Icon} size={18} className="text-zinc-400 shrink-0" />
              <h3 className="font-bold text-white tracking-tight truncate font-sans text-sm" title={file.name}>
                {file.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onDownload(file)}
                className="h-8 px-3 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center gap-1.5 hover:bg-zinc-200 cursor-pointer shadow"
              >
                <HugeiconsIcon icon={Download01Icon} size={14} />
                <span>Download</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>
          </div>

          {/* Preview Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {/* Media/Content Viewer */}
            <div className="w-full min-h-[240px] rounded-lg bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-center p-4 overflow-hidden relative">
              {category === 'image' && resolvedUrl ? (
                <img
                  src={resolvedUrl}
                  alt={file.name}
                  className="max-w-full max-h-[60vh] object-contain rounded shadow-lg"
                />
              ) : category === 'video' && resolvedUrl ? (
                <video
                  src={resolvedUrl}
                  controls
                  className="w-full max-h-[60vh] rounded shadow-lg"
                />
              ) : category === 'audio' && resolvedUrl ? (
                <div className="w-full p-6 text-center space-y-3">
                  <span className="text-4xl">🎵</span>
                  <audio src={resolvedUrl} controls className="w-full mt-4" />
                </div>
              ) : category === 'pdf' && resolvedUrl ? (
                <iframe
                  src={resolvedUrl}
                  title={file.name}
                  className="w-full h-[60vh] rounded border-none"
                />
              ) : category === 'code' ? (
                isLoadingContent ? (
                  <div className="p-8 text-center text-zinc-500 font-mono">Loading code preview...</div>
                ) : (
                  <div className="w-full text-left font-mono">
                    <MarkdownCodeBlock language={file.name.split('.').pop()} code={textContent || ''} />
                  </div>
                )
              ) : file.name.endsWith('.md') ? (
                isLoadingContent ? (
                  <div className="p-8 text-center text-zinc-500 font-mono">Loading markdown...</div>
                ) : (
                  <div className="w-full text-left text-zinc-200">
                    <MarkdownRenderer content={textContent || ''} />
                  </div>
                )
              ) : (
                <div className="p-8 text-center space-y-3 text-zinc-400">
                  <HugeiconsIcon icon={File01Icon} size={48} className="mx-auto text-zinc-600" />
                  <p className="text-xs font-mono text-zinc-400">
                    No inline preview available for this file type.
                  </p>
                  <button
                    type="button"
                    onClick={() => onDownload(file)}
                    className="px-4 py-2 rounded-md bg-zinc-800 text-white font-mono hover:bg-zinc-700 cursor-pointer text-xs"
                  >
                    Download File ({formatBytes(file.size)})
                  </button>
                </div>
              )}
            </div>

            {/* Metadata Specification Table */}
            <div className="space-y-3 border-t border-zinc-800/80 pt-4">
              <h4 className="font-semibold text-white tracking-tight uppercase text-[11px] text-zinc-400">
                File Metadata
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">File Size</span>
                  <span className="text-zinc-200 font-semibold">{formatBytes(file.size)}</span>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">MIME Type</span>
                  <span className="text-zinc-200 font-semibold truncate block">{file.mimeType}</span>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Created At</span>
                  <span className="text-zinc-200 font-semibold">{new Date(file.createdAt).toLocaleString()}</span>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Uploaded By</span>
                  <span className="text-zinc-200 font-semibold">{file.uploadedBy || 'System Lead'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};

export default FilePreviewDrawer;
