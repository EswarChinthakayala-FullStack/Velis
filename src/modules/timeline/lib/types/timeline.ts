export type TimelineUpdateType =
  | 'feature'
  | 'bug_fix'
  | 'deployment'
  | 'milestone'
  | 'documentation'
  | 'database'
  | 'backend'
  | 'frontend'
  | 'design'
  | 'general';

export type TimelineVisibility = 'public' | 'private';

export interface TimelineAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface TimelineEntry {
  id: string;
  projectId: string;
  title: string;
  description: string;
  entryDate: string; // ISO date string
  updateType: TimelineUpdateType;
  visibility: TimelineVisibility;
  tags: string[];
  attachments: TimelineAttachment[];
  createdBy?: string;
  authorName?: string;
  createdAt: string;
}

export interface CreateTimelineEntryPayload {
  projectId: string;
  title: string;
  description: string;
  entryDate?: string;
  updateType?: TimelineUpdateType;
  visibility?: TimelineVisibility;
  tags?: string[];
  attachments?: TimelineAttachment[];
}

export interface TimelineFilterState {
  search: string;
  updateType: 'all' | TimelineUpdateType;
  visibility: 'all' | TimelineVisibility;
}

export interface DateGroupedTimeline {
  groupLabel: string;
  entries: TimelineEntry[];
}
