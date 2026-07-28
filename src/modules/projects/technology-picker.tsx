import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechnologyChip } from './components/TechnologyChip';
import { TechnologyIcon } from './components/TechnologyIcon';
import { TechnologyCreateDialog } from './components/TechnologyCreateDialog';
import {
  usePopularTechnologies,
  useRecentTechnologies,
  useAddProjectTechnology,
  useRemoveProjectTechnology,
} from '../../lib/supabase/queries/technologies';
import type { TechnologyItem } from '../../types/technology';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Add01Icon,
  Tick02Icon,
  SparklesIcon,
  Time01Icon,
  GridIcon,
} from '@hugeicons/core-free-icons';
import { RadialSpinner } from './components/RadialSpinner';

// Predefined catalog of popular technology stacks
const PREDEFINED_TECH_CATALOG = [
  'React',
  'Next.js',
  'FastAPI',
  'Python',
  'Kotlin',
  'Supabase',
  'PostgreSQL',
  'Docker',
  'Vercel',
  'TypeScript',
  'Node.js',
  'Express',
  'NestJS',
  'Vue.js',
  'Angular',
  'Svelte',
  'Astro',
  'Android',
  'Swift',
  'Flutter',
  'React Native',
  'MySQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'Prisma',
  'Tailwind CSS',
  'Java',
  'C#',
  'Go',
  'Rust',
  'AWS',
  'Firebase',
];

interface TechnologyPickerProps {
  projectId: string;
  value: TechnologyItem[];
  onChange?: (technologies: TechnologyItem[]) => void;
  readOnly?: boolean;
}

export const TechnologyPicker: React.FC<TechnologyPickerProps> = ({
  projectId,
  value = [],
  onChange,
  readOnly = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: popularTech = [] } = usePopularTechnologies();
  const { data: recentTech = [] } = useRecentTechnologies();

  const addMutation = useAddProjectTechnology();
  const removeMutation = useRemoveProjectTechnology();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter available options
  const existingNames = useMemo(() => {
    return new Set(value.map((t) => t.name.toLowerCase().trim()));
  }, [value]);

  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    // Combine catalog + popular + recent
    const allNames = Array.from(
      new Set([
        ...PREDEFINED_TECH_CATALOG,
        ...popularTech.map((t) => t.name),
        ...recentTech.map((t) => t.name),
      ])
    );

    return allNames
      .filter((name) => !existingNames.has(name.toLowerCase()))
      .filter((name) => (trimmed ? name.toLowerCase().includes(trimmed) : true));
  }, [query, existingNames, popularTech, recentTech]);

  const showCreateOption = useMemo(() => {
    if (!query.trim()) return false;
    const trimmed = query.trim().toLowerCase();
    const exactMatch = filteredOptions.some((name) => name.toLowerCase() === trimmed);
    const alreadySelected = existingNames.has(trimmed);
    return !exactMatch && !alreadySelected;
  }, [query, filteredOptions, existingNames]);

  const totalNavItems = filteredOptions.length + (showCreateOption ? 1 : 0);

  // Keyboard navigation
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !query && value.length > 0) {
      // Remove last tag on Backspace when query is empty
      const lastTech = value[value.length - 1];
      if (lastTech.id) {
        handleRemove(lastTech);
      }
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalNavItems));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalNavItems) % Math.max(1, totalNavItems));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showCreateOption && selectedIndex === filteredOptions.length) {
        await handleAdd(query.trim());
      } else if (filteredOptions[selectedIndex]) {
        await handleAdd(filteredOptions[selectedIndex]);
      }
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAdd = async (techName: string) => {
    if (!projectId || !techName.trim()) return;
    setErrorMessage(null);
    try {
      const newTech = await addMutation.mutateAsync({
        projectId,
        name: techName.trim(),
      });

      const updated = [...value, newTech];
      if (onChange) onChange(updated);

      setQuery('');
      setSelectedIndex(0);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add technology due to security policy');
    }
  };

  const handleRemove = async (tech: TechnologyItem) => {
    if (!projectId || !tech.id) return;
    setErrorMessage(null);
    try {
      await removeMutation.mutateAsync({ id: tech.id, projectId });
      const updated = value.filter((t) => t.id !== tech.id);
      if (onChange) onChange(updated);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove technology');
    }
  };

  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);

  const handleAddCustom = async (techName: string, iconUrl?: string) => {
    if (!projectId || !techName.trim()) return;
    setErrorMessage(null);
    try {
      const newTech = await addMutation.mutateAsync({
        projectId,
        name: techName.trim(),
        iconUrl: iconUrl || undefined,
      });

      const updated = [...value, newTech];
      if (onChange) onChange(updated);

      setQuery('');
      setIsOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add technology');
    }
  };

  return (
    <div ref={containerRef} className="relative z-30 w-full select-none" onKeyDown={handleKeyDown}>
      {errorMessage && (
        <div className="mb-2 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-mono flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Selected Chips & Search Trigger */}
      <div
        onClick={() => {
          if (!readOnly) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
        className={`flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all ${
          readOnly ? 'cursor-default' : 'cursor-text'
        }`}
      >
        {value.map((tech) => (
          <TechnologyChip
            key={tech.id || tech.name}
            name={tech.name}
            iconUrl={tech.iconUrl}
            onRemove={readOnly ? undefined : () => handleRemove(tech)}
          />
        ))}

        {!readOnly && (
          <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
            <HugeiconsIcon icon={Search01Icon} size={14} className="text-zinc-500 shrink-0 ml-1" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setSelectedIndex(0);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={value.length === 0 ? 'Search or add technologies (e.g. React, Supabase)...' : 'Add tech...'}
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none font-mono py-1"
            />
            {addMutation.isPending && (
              <RadialSpinner size={14} className="text-zinc-400 shrink-0 mr-1" />
            )}
          </div>
        )}
      </div>

      {/* Floating Liquid Glass Dropdown */}
      <AnimatePresence>
        {isOpen && !readOnly && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 z-[9999] rounded-xl bg-[rgba(12,13,17,0.98)] border border-zinc-800/90 shadow-2xl backdrop-blur-2xl overflow-hidden max-h-[360px] flex flex-col"
          >
            {/* Header / Recent & Popular Tabs */}
            {!query.trim() && (
              <div className="px-3 py-2 bg-zinc-900/60 border-b border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={SparklesIcon} size={12} className="text-amber-400" />
                  <span>Popular Tech Stacks</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsCustomDialogOpen(true);
                  }}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-sans font-medium cursor-pointer"
                >
                  <span>+ Customize Tech</span>
                </button>
              </div>
            )}

            {/* Suggestions List */}
            <div className="overflow-y-auto custom-scrollbar p-1.5 space-y-0.5 max-h-[280px]">
              {/* Filtered Matches */}
              {filteredOptions.map((name, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => handleAdd(name)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TechnologyIcon name={name} size={16} />
                      <span>{name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <span>Add</span>
                      <HugeiconsIcon icon={Add01Icon} size={12} />
                    </div>
                  </button>
                );
              })}

              {/* Free-Text Custom Creation Option */}
              {showCreateOption && (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleAdd(query.trim())}
                    onMouseEnter={() => setSelectedIndex(filteredOptions.length)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer border border-dashed border-zinc-700/60 ${
                      selectedIndex === filteredOptions.length
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'text-amber-300 bg-zinc-900/40 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Add01Icon} size={14} className="text-amber-400" />
                      <span>Create Technology &quot;{query.trim()}&quot;</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">Press Enter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsCustomDialogOpen(true);
                    }}
                    className="w-full text-center py-1.5 text-xs text-zinc-400 hover:text-white font-mono hover:bg-zinc-900 rounded cursor-pointer"
                  >
                    ⚙ Add Custom Icon / Logo URL...
                  </button>
                </div>
              )}

              {filteredOptions.length === 0 && !showCreateOption && (
                <div className="p-6 text-center text-xs font-mono text-zinc-500 italic space-y-2">
                  <p>All catalog technologies added.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsCustomDialogOpen(true);
                    }}
                    className="text-amber-400 hover:underline font-sans not-italic text-xs cursor-pointer"
                  >
                    + Add Custom Technology
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technology Customization Dialog */}
      <TechnologyCreateDialog
        isOpen={isCustomDialogOpen}
        onClose={() => setIsCustomDialogOpen(false)}
        onAdd={handleAddCustom}
        initialName={query.trim()}
      />
    </div>
  );
};

export default TechnologyPicker;
