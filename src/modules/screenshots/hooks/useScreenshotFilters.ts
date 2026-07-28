import { useMemo, useState } from 'react';
import type { ScreenshotItem, GalleryLayoutMode, ScreenshotSortOrder } from '../lib/types/screenshot';

export function useScreenshotFilters(screenshots: ScreenshotItem[] = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<GalleryLayoutMode>('grid');
  const [sortOrder, setSortOrder] = useState<ScreenshotSortOrder>('taken_at_desc');

  // Extract unique module names from screenshots list
  const availableModules = useMemo(() => {
    const set = new Set<string>();
    for (const item of screenshots) {
      if (item.moduleName) set.add(item.moduleName);
    }
    return Array.from(set).sort();
  }, [screenshots]);

  // Extract unique milestones from screenshots list
  const availableMilestones = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of screenshots) {
      if (item.milestoneId) {
        map.set(item.milestoneId, item.milestoneTitle || 'Milestone Progress');
      }
    }
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [screenshots]);

  const filteredScreenshots = useMemo(() => {
    let result = [...screenshots];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.moduleName && item.moduleName.toLowerCase().includes(q))
      );
    }

    // 2. Filter by Milestone
    if (selectedMilestoneId) {
      result = result.filter((item) => item.milestoneId === selectedMilestoneId);
    }

    // 3. Filter by Module
    if (selectedModule) {
      result = result.filter((item) => item.moduleName === selectedModule);
    }

    // 4. Sort Order
    result.sort((a, b) => {
      if (sortOrder === 'taken_at_desc') {
        return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime();
      }
      if (sortOrder === 'taken_at_asc') {
        return new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime();
      }
      if (sortOrder === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [screenshots, searchQuery, selectedMilestoneId, selectedModule, sortOrder]);

  return {
    searchQuery,
    setSearchQuery,
    selectedMilestoneId,
    setSelectedMilestoneId,
    selectedModule,
    setSelectedModule,
    layoutMode,
    setLayoutMode,
    sortOrder,
    setSortOrder,
    availableModules,
    availableMilestones,
    filteredScreenshots,
  };
}
