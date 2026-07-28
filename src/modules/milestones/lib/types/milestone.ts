export type MilestoneStatus = 'planned' | 'in_progress' | 'blocked' | 'completed';

export interface MilestoneAttachmentItem {
  id: string;
  milestoneId: string;
  fileName: string;
  fileUrl: string;
}

export interface MilestoneItem {
  id: string;
  projectId: string;
  name: string;
  progress: number; // 0 to 100
  notes?: string;
  dueDate?: string; // YYYY-MM-DD
  completionDate?: string; // YYYY-MM-DD
  sortOrder: number;
  attachments?: MilestoneAttachmentItem[];
  createdAt: string;
}

export interface CreateMilestonePayload {
  projectId: string;
  name: string;
  progress?: number;
  notes?: string;
  dueDate?: string;
  completionDate?: string;
  sortOrder?: number;
}

export interface UpdateMilestonePayload {
  name?: string;
  progress?: number;
  notes?: string;
  dueDate?: string | null;
  completionDate?: string | null;
  sortOrder?: number;
}

export interface MilestoneSummaryStats {
  total: number;
  completed: number;
  inProgress: number;
  planned: number;
  overallProgress: number;
}
