import { useMemo } from 'react';
import type { ScreenshotItem, MilestoneGroup } from '../lib/types/screenshot';
import { groupScreenshotsByMilestoneAndDate } from '../lib/utils/grouping';

export function useScreenshotGrouping(filteredScreenshots: ScreenshotItem[]) {
  const milestoneGroups: MilestoneGroup[] = useMemo(() => {
    return groupScreenshotsByMilestoneAndDate(filteredScreenshots);
  }, [filteredScreenshots]);

  return { milestoneGroups };
}
