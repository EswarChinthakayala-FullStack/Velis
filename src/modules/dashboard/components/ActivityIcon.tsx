import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FolderCheckIcon,
  Task01Icon,
  GitBranchIcon,
  FileUploadIcon,
  Clock01Icon,
  UserGroupIcon,
  Link01Icon,
  Chat01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';

interface ActivityIconProps {
  entityType: string;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({ entityType }) => {
  const getIcon = () => {
    switch (entityType?.toLowerCase()) {
      case 'project':
        return FolderCheckIcon;
      case 'task':
        return Task01Icon;
      case 'github':
      case 'commit':
      case 'repo':
        return GitBranchIcon;
      case 'file':
      case 'document':
        return FileUploadIcon;
      case 'milestone':
        return Clock01Icon;
      case 'client':
        return UserGroupIcon;
      case 'share_link':
      case 'share':
      case 'portal':
        return Link01Icon;
      case 'comment':
        return Chat01Icon;
      default:
        return CheckmarkCircle01Icon;
    }
  };

  return (
    <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800/80 text-white shrink-0 shadow-inner flex items-center justify-center">
      <HugeiconsIcon icon={getIcon()} size={16} className="text-zinc-200" />
    </div>
  );
};

export default ActivityIcon;
