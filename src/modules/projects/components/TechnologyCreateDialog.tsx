import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TechnologyChip } from './TechnologyChip';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Tick02Icon,
  PencilEdit01Icon,
  Image01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { RadialSpinner } from './RadialSpinner';

interface TechnologyCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, iconUrl?: string) => Promise<void>;
  initialName?: string;
}

export const TechnologyCreateDialog: React.FC<TechnologyCreateDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [iconUrl, setIconUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setIconUrl('');
    }
  }, [isOpen, initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onAdd(name.trim(), iconUrl.trim() || undefined);
      onClose();
    } catch (err) {
      console.error('Failed to create custom technology:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full max-w-md bg-zinc-950/95 border border-zinc-800/90 rounded-sm shadow-2xl overflow-hidden text-zinc-100 font-sans my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-zinc-900/90 border-b border-zinc-800/90">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-sm bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-amber-400">
                  <HugeiconsIcon icon={SparklesIcon} size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Customize Technology</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Specify custom name and optional logo URL
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
              {/* Preview Chip */}
              <div className="p-3 rounded-sm bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                  Live Preview
                </span>
                <div className="flex items-center gap-2">
                  <TechnologyChip name={name || 'Technology Name'} iconUrl={iconUrl || undefined} />
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-zinc-300 flex items-center gap-1.5">
                  <HugeiconsIcon icon={PencilEdit01Icon} size={13} className="text-zinc-500" />
                  <span>Technology Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Astro, Tailwind CSS, Redis..."
                  className="w-full px-3 py-2 rounded-sm bg-zinc-900/90 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-zinc-600 transition-all"
                />
              </div>

              {/* Custom Icon URL Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Image01Icon} size={13} className="text-zinc-500" />
                    <span>Custom Icon URL (Optional)</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">jsDelivr / SVG / PNG</span>
                </label>
                <input
                  type="url"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/.../....svg"
                  className="w-full px-3 py-2 rounded-sm bg-zinc-900/90 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-600"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-white text-black font-bold text-xs font-mono hover:bg-zinc-200 transition-colors cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RadialSpinner size={13} className="text-black" />
                  ) : (
                    <HugeiconsIcon icon={Tick02Icon} size={13} />
                  )}
                  <span>{isSubmitting ? 'Saving...' : 'Add Technology'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TechnologyCreateDialog;
