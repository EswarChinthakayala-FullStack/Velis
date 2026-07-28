import { useMemo, useState } from 'react';
import type { FileItem, FolderItem, FileCategory, FileSortField, SortOrder } from '../lib/types/file';
import { getCategoryFromMimeOrExt } from '../lib/utils/mime-utils';

export function useSearchFiles(
  files: FileItem[] = [],
  folders: FolderItem[] = []
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [sortField, setSortField] = useState<FileSortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const q = searchQuery.toLowerCase();
    return folders.filter((f) => f.name.toLowerCase().includes(q));
  }, [folders, searchQuery]);

  const filteredFiles = useMemo(() => {
    let result = [...files];

    // 1. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (file) =>
          file.name.toLowerCase().includes(q) ||
          file.mimeType.toLowerCase().includes(q) ||
          file.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 2. Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (file) => getCategoryFromMimeOrExt(file.mimeType, file.name) === selectedCategory
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      let comp = 0;
      if (sortField === 'name') {
        comp = a.name.localeCompare(b.name);
      } else if (sortField === 'size') {
        comp = a.size - b.size;
      } else if (sortField === 'updated_at') {
        comp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortField === 'mime_type') {
        comp = a.mimeType.localeCompare(b.mimeType);
      }

      return sortOrder === 'asc' ? comp : -comp;
    });

    return result;
  }, [files, searchQuery, selectedCategory, sortField, sortOrder]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filteredFiles,
    filteredFolders,
  };
}
