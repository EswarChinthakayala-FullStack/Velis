import type { TocHeadingItem } from '../../types/documentation';

/**
 * Extracts H1, H2, H3 headings linearly in O(N) time to generate Table of Contents items.
 */
export function extractTocHeadings(text: string): TocHeadingItem[] {
  if (!text) return [];
  const items: TocHeadingItem[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].replace(/`|\*|_|\[.*?\]\(.*?\)/g, '').trim();
      const id = rawText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (id && rawText) {
        items.push({ id, text: rawText, level });
      }
    }
  }

  return items;
}
