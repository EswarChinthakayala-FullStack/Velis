import { format, parseISO } from 'date-fns';
import type { ScreenshotItem, MilestoneGroup, DateGroup } from '../types/screenshot';

export function groupScreenshotsByMilestoneAndDate(items: ScreenshotItem[]): MilestoneGroup[] {
  const milestoneMap = new Map<string, { title: string; items: ScreenshotItem[] }>();

  // 1. Partition items by milestone
  for (const item of items) {
    const key = item.milestoneId || 'unassigned';
    const title = item.milestoneTitle || (item.milestoneId ? 'Milestone Progress' : 'General Updates');

    if (!milestoneMap.has(key)) {
      milestoneMap.set(key, { title, items: [] });
    }
    milestoneMap.get(key)!.items.push(item);
  }

  const result: MilestoneGroup[] = [];

  // 2. Partition milestone items by taken_at date
  for (const [key, milestoneData] of milestoneMap.entries()) {
    const dateMap = new Map<string, ScreenshotItem[]>();

    for (const item of milestoneData.items) {
      let dateKey = 'Undated';
      let dateLabel = 'Undated';

      if (item.takenAt) {
        try {
          const parsed = parseISO(item.takenAt);
          dateKey = format(parsed, 'yyyy-MM-dd');
          dateLabel = format(parsed, 'MMMM d, yyyy');
        } catch {
          dateKey = item.takenAt.split('T')[0] || 'Undated';
          dateLabel = dateKey;
        }
      }

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(item);
    }

    const dateGroups: DateGroup[] = [];
    for (const [dKey, dItems] of dateMap.entries()) {
      let label = dKey;
      if (dItems[0]?.takenAt) {
        try {
          label = format(parseISO(dItems[0].takenAt), 'MMMM d, yyyy');
        } catch {
          label = dKey;
        }
      }

      dateGroups.push({
        dateKey: dKey,
        dateLabel: label,
        items: dItems,
      });
    }

    result.push({
      milestoneId: key === 'unassigned' ? null : key,
      milestoneTitle: milestoneData.title,
      dateGroups,
      totalCount: milestoneData.items.length,
    });
  }

  return result;
}
