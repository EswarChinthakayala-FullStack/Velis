export type ViewMode = 
  | 'dashboard'
  | 'projects'
  | 'clients'
  | 'tasks'
  | 'milestones'
  | 'github'
  | 'docs'
  | 'files'
  | 'timeline'
  | 'client_portal'
  | 'share-links'
  | 'payments'
  | 'changelog'
  | 'notes'
  | 'deployments'
  | 'notifications'
  | 'settings';

export type ProjectStatus = 'in_progress' | 'review' | 'completed' | 'on_hold' | 'planning';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  dueDate: string;
  githubRepo: string;
  priority: 'high' | 'medium' | 'low';
  membersCount: number;
}

export interface GitHubRepo {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  openPRs: number;
  defaultBranch: string;
  commitsCount: number;
  updatedAt: string;
  language: string;
}

export interface Commit {
  id: string;
  hash: string;
  message: string;
  author: string;
  avatar: string;
  date?: string;
  branch: string;
  repoName?: string;
  timestamp?: string;
}

export interface PullRequest {
  id: string;
  number?: number;
  title: string;
  author: string;
  avatar?: string;
  status: 'open' | 'merged' | 'closed';
  branch: string;
  createdAt?: string;
  commentsCount: number;
  additions?: number;
  deletions?: number;
  repoName?: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'completed' | 'in_progress' | 'pending';
  progress: number;
  tasksCount?: number;
  completedTasksCount?: number;
  projectName?: string;
  phase?: string;
}

export interface DocPage {
  id: string;
  title: string;
  category: string;
  updatedAt?: string;
  author: string;
  readTime?: string;
  tags: string[];
  content?: string;
  isPublic?: boolean;
  lastEdited?: string;
}

export interface AssetFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  url?: string;
  category: 'code' | 'design' | 'doc' | 'archive' | 'contracts' | 'designs' | 'credentials';
  isSecret?: boolean;
  secretValue?: string;
  secureUrl?: string;
}

export interface ClientPortal {
  id: string;
  clientName: string;
  projectName?: string;
  activeToken?: string;
  lastActive: string;
  status?: 'active' | 'expired' | 'revoked';
  company?: string;
  avatarUrl?: string;
  satisfactionRating?: number;
  activeProjectsCount?: number;
  unpaidInvoicesTotal?: number;
  email?: string;
}

export interface Invoice {
  id: string;
  number?: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  clientName?: string;
  projectName?: string;
  issuedDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp?: string;
  time?: string;
  read: boolean;
  type: 'project' | 'task' | 'billing' | 'system' | 'commit' | 'invoice' | 'approval';
}
