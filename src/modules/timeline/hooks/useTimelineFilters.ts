import { useState, useMemo } from 'react';
import type { TimelineEntry, TimelineFilterState, TimelineUpdateType } from '../lib/types/timeline';

export function useTimelineFilters(entries: TimelineEntry[]) {
  const [filters, setFilters] = useState<TimelineFilterState>({
    search: '',
    updateType: 'all',
    visibility: 'all',
  });

  const setSearch = (search: string) => setFilters((prev) => ({ ...prev, search }));
  const setUpdateType = (updateType: 'all' | TimelineUpdateType) => setFilters((prev) => ({ ...prev, updateType }));
  const setVisibility = (visibility: 'all' | 'public' | 'private') => setFilters((prev) => ({ ...prev, visibility }));
  const resetFilters = () => setFilters({ search: '', updateType: 'all', visibility: 'all' });

  const filteredEntries = useMemo(() => {
    if (!entries) return [];

    return entries.filter((item) => {
      // 1. Search Filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      // 2. Category / Update Type Filter
      if (filters.updateType !== 'all' && item.updateType !== filters.updateType) {
        return false;
      }

      // 3. Visibility Filter
      if (filters.visibility !== 'all' && item.visibility !== filters.visibility) {
        return false;
      }

      return true;
    });
  }, [entries, filters]);

  return {
    filters,
    setSearch,
    setUpdateType,
    setVisibility,
    resetFilters,
    filteredEntries,
  };
}

export default useTimelineFilters;
