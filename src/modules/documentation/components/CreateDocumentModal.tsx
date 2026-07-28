import React, { useState, useEffect } from 'react';
import type { DocumentItem, DocumentCategory, DocumentStatus } from '../lib/types/documentation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, FloppyDiskIcon, FileCodeIcon, Loading02Icon } from '@hugeicons/core-free-icons';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentToEdit?: DocumentItem | null;
  onSubmit: (data: {
    title: string;
    content: string;
    category: DocumentCategory;
    status: DocumentStatus;
    version: string;
    author: string;
    isClientVisible: boolean;
    tags: string[];
  }) => void;
  isSubmitting?: boolean;
}

const CATEGORIES: DocumentCategory[] = [
  'Technical',
  'API',
  'Deployment',
  'Database',
  'User Guide',
  'Internal',
  'Client Visible',
];

export const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({
  isOpen,
  onClose,
  documentToEdit,
  onSubmit,
  isSubmitting = false,
}) => {
  const isEditMode = Boolean(documentToEdit);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Technical');
  const [status, setStatus] = useState<DocumentStatus>('approved');
  const [version, setVersion] = useState('1.0.0');
  const [author, setAuthor] = useState('System Lead');
  const [isClientVisible, setIsClientVisible] = useState(true);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (documentToEdit) {
      setTitle(documentToEdit.title);
      setContent(documentToEdit.content);
      setCategory(documentToEdit.category);
      setStatus(documentToEdit.status);
      setVersion(documentToEdit.version);
      setAuthor(documentToEdit.author || 'System Lead');
      setIsClientVisible(documentToEdit.isClientVisible);
      setTagsInput(documentToEdit.tags?.join(', ') || '');
    } else {
      setTitle('');
      setContent('# Document Title\n\nStart writing documentation here...');
      setCategory('Technical');
      setStatus('approved');
      setVersion('1.0.0');
      setAuthor('System Lead');
      setIsClientVisible(true);
      setTagsInput('');
    }
  }, [documentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      content,
      category,
      status,
      version: version.trim() || '1.0.0',
      author: author.trim() || 'System Lead',
      isClientVisible,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-lg bg-[#0c0c0e] border border-zinc-800 shadow-2xl p-6 font-mono space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FileCodeIcon} size={18} className="text-zinc-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              {isEditMode ? 'Edit Document' : 'Create New Document'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System Architecture & Component Diagram"
              className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Category</label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as DocumentCategory)}
              >
                <SelectTrigger className="h-9 font-mono">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Lead Architect"
                className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white outline-none font-mono"
              />
            </div>
          </div>

          {/* Visibility Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isClientVisible"
              checked={isClientVisible}
              onChange={(e) => setIsClientVisible(e.target.checked)}
              className="accent-white cursor-pointer w-4 h-4 rounded"
            />
            <label htmlFor="isClientVisible" className="text-xs text-zinc-300 cursor-pointer">
              Client Portal Visible (Allowed for secure client viewing)
            </label>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Architecture, API, Endpoints"
              className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white outline-none font-mono"
            />
          </div>

          {/* Markdown Content */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Markdown Content</label>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type markdown content here..."
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-200 outline-none focus:border-zinc-700 font-mono leading-relaxed custom-scrollbar"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-zinc-200 cursor-pointer shadow disabled:opacity-75 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <RadialSpinner size={14} className="text-black" />
                  <span>{isEditMode ? 'Saving Changes...' : 'Creating Document...'}</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
                  <span>{isEditMode ? 'Save Changes' : 'Create Document'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDocumentModal;
