import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import type { ProjectSection } from '../../../types/project-section';

interface ProjectTabsProps {
  sections: ProjectSection[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  onAddSection?: (name: string) => void;
}

export const ProjectTabs: React.FC<ProjectTabsProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
  onAddSection,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionName.trim() && onAddSection) {
      onAddSection(newSectionName.trim());
      setNewSectionName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-zinc-800/80 custom-scrollbar select-none">
      {sections.map((section) => {
        const isActive = section.id === activeSectionId;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelectSection(section.id)}
            className={`relative px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isActive
                ? 'text-white bg-zinc-900/90 border-t border-x border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
          >
            <span>{section.name}</span>

            {/* Active Indicator Line */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            )}
          </button>
        );
      })}

      {/* Add Section Trigger */}
      {onAddSection && (
        isAdding ? (
          <form onSubmit={handleAddSubmit} className="flex items-center gap-1 px-2 py-1 shrink-0">
            <input
              type="text"
              autoFocus
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Section Name..."
              className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-xs text-white rounded outline-none w-28 font-mono"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-white text-black font-semibold text-xs rounded cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-zinc-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={13} />
            <span>Add Section</span>
          </button>
        )
      )}
    </div>
  );
};

export default ProjectTabs;
