import React, { useEffect, useState, useCallback } from 'react';
import type { TocHeadingItem } from '../lib/types/documentation';
import { HugeiconsIcon } from '@hugeicons/react';
import { MenuIcon } from '@hugeicons/core-free-icons';

interface MarkdownTOCProps {
  headings: TocHeadingItem[];
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const MarkdownTOC: React.FC<MarkdownTOCProps> = ({ headings, scrollContainerRef }) => {
  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = useCallback(() => {
    if (headings.length === 0) return;

    const container = scrollContainerRef?.current;
    if (!container) return;

    const scrollTop = container.scrollTop + 120;

    for (let i = headings.length - 1; i >= 0; i--) {
      const item = headings[i];
      const el = document.getElementById(item.id);
      if (el && el.offsetTop <= scrollTop) {
        setActiveId(item.id);
        return;
      }
    }

    if (headings[0]) setActiveId(headings[0].id);
  }, [headings, scrollContainerRef]);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container || headings.length === 0) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll, scrollContainerRef, headings]);

  // Reset active when headings change (new document selected)
  useEffect(() => {
    if (headings.length > 0) {
      setActiveId(headings[0].id);
    }
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="w-52 shrink-0 hidden lg:flex flex-col h-full border-l border-zinc-800/60 bg-[#09090b]/50">
      {/* Header */}
      <div className="px-4 py-3 shrink-0 border-b border-zinc-800/40 flex items-center gap-1.5">
        <HugeiconsIcon icon={MenuIcon} size={13} className="text-zinc-500" />
        <span className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
          On this page
        </span>
      </div>

      {/* Scrollable TOC list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 px-1">
        <div className="space-y-px border-l border-zinc-800/60 ml-3">
          {headings.map((item) => {
            const isActive = activeId === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const targetEl = document.getElementById(item.id);
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveId(item.id);
                  }
                }}
                style={{ paddingLeft: `${(item.level - 1) * 0.75 + 0.75}rem` }}
                className={`relative block py-1.5 text-[11px] transition-all duration-150 truncate -ml-[1px] ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {/* Active left border indicator */}
                <span
                  className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-white'
                      : 'bg-transparent'
                  }`}
                />
                {item.text}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MarkdownTOC;
