import { useMemo, useState, useEffect } from 'react';
import type { DocumentItem, DocumentCategory } from '../lib/types/documentation';

export function useSearchDocuments(
  documents: DocumentItem[] = [],
  initialCategory: DocumentCategory | 'all' = 'all'
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>(
    initialCategory
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category Filter
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }

      // Search Query Filter
      if (!debouncedQuery) return true;

      const titleMatch = doc.title.toLowerCase().includes(debouncedQuery);
      const contentMatch = doc.content.toLowerCase().includes(debouncedQuery);
      const tagMatch = doc.tags?.some((t) => t.toLowerCase().includes(debouncedQuery));
      const categoryMatch = doc.category.toLowerCase().includes(debouncedQuery);

      return titleMatch || contentMatch || tagMatch || categoryMatch;
    });
  }, [documents, debouncedQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredDocuments,
  };
}

export default useSearchDocuments;
