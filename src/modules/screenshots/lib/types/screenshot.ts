export type GalleryLayoutMode = 'grid' | 'masonry' | 'timeline';

export type ScreenshotSortOrder = 'taken_at_desc' | 'taken_at_asc' | 'title';

export interface ScreenshotItem {
  id: string;
  projectId?: string | null;
  milestoneId?: string | null;
  milestoneTitle?: string | null;
  title: string;
  description?: string | null;
  storagePath: string;
  publicUrl?: string | null;
  signedUrl?: string | null;
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  moduleName?: string | null;
  takenAt: string;
  sortOrder: number;
  uploadedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DateGroup {
  dateLabel: string;
  dateKey: string;
  items: ScreenshotItem[];
}

export interface MilestoneGroup {
  milestoneId: string | null;
  milestoneTitle: string;
  dateGroups: DateGroup[];
  totalCount: number;
}

export interface ScreenshotFilterOptions {
  searchQuery: string;
  selectedMilestoneId: string | null;
  selectedModule: string | null;
  sortOrder: ScreenshotSortOrder;
}
