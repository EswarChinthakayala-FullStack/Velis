import {
  isToday,
  isYesterday,
  isThisWeek,
  subWeeks,
  format,
  parseISO,
  isAfter,
} from 'date-fns';
import type { TimelineEntry, DateGroupedTimeline } from '../types/timeline';

export function groupTimelineEntriesByDate(entries: TimelineEntry[]): DateGroupedTimeline[] {
  if (!entries || entries.length === 0) return [];

  // Sort newest first
  const sorted = [...entries].sort((a, b) => {
    const dateA = a.entryDate || a.createdAt;
    const dateB = b.entryDate || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const groups: Record<string, TimelineEntry[]> = {};
  const lastWeekStart = subWeeks(new Date(), 1);

  sorted.forEach((entry) => {
    const rawDate = entry.entryDate || entry.createdAt;
    let dateObj: Date;

    try {
      dateObj = parseISO(rawDate);
      if (isNaN(dateObj.getTime())) {
        dateObj = new Date(rawDate);
      }
    } catch {
      dateObj = new Date();
    }

    let groupLabel = 'Older';

    if (isToday(dateObj)) {
      groupLabel = 'Today';
    } else if (isYesterday(dateObj)) {
      groupLabel = 'Yesterday';
    } else if (isThisWeek(dateObj)) {
      groupLabel = 'This Week';
    } else if (isAfter(dateObj, lastWeekStart)) {
      groupLabel = 'Last Week';
    } else {
      groupLabel = format(dateObj, 'MMMM yyyy');
    }

    if (!groups[groupLabel]) {
      groups[groupLabel] = [];
    }
    groups[groupLabel].push(entry);
  });

  // Preserve logical group order
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Last Week'];
  const result: DateGroupedTimeline[] = [];

  // Add standard groups in order
  groupOrder.forEach((label) => {
    if (groups[label] && groups[label].length > 0) {
      result.push({ groupLabel: label, entries: groups[label] });
      delete groups[label];
    }
  });

  // Add remaining monthly/older groups in sorted order
  Object.keys(groups).forEach((label) => {
    result.push({ groupLabel: label, entries: groups[label] });
  });

  return result;
}
