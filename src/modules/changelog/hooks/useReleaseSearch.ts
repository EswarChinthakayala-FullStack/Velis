import { useState, useMemo } from 'react';
import type { ChangelogEntry, ReleaseType, ReleaseStatus } from '../types/changelog';

export function useReleaseSearch(entries: ChangelogEntry[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // 1. Release Type filter
      if (selectedType !== 'all' && entry.releaseType !== selectedType) {
        return false;
      }

      // 2. Status filter
      if (selectedStatus !== 'all' && entry.status !== selectedStatus) {
        return false;
      }

      // 3. Search query filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchVersion = entry.version.toLowerCase().includes(q);
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchSummary = (entry.summary || '').toLowerCase().includes(q);
      const matchDesc = (entry.description || '').toLowerCase().includes(q);

      return matchVersion || matchTitle || matchSummary || matchDesc;
    });
  }, [entries, searchQuery, selectedType, selectedStatus]);

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    filteredEntries,
  };
}
