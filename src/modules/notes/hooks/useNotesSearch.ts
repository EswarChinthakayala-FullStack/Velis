import { useState, useMemo } from 'react';
import type { NoteItem } from '../types/note';

export function useNotesSearch(notes: NoteItem[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewState, setViewState] = useState<'active' | 'pinned' | 'archived'>('active');

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // 1. View state filter (Active vs Pinned vs Archived)
      if (viewState === 'archived') {
        if (!note.isArchived) return false;
      } else {
        if (note.isArchived) return false;
        if (viewState === 'pinned' && !note.isPinned) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && note.category !== selectedCategory) {
        return false;
      }

      // 3. Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTags = note.tags.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchContent || matchTags;
    });
  }, [notes, searchQuery, selectedCategory, viewState]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewState,
    setViewState,
    filteredNotes,
  };
}
