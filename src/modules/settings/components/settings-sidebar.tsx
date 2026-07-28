import React from 'react';
import type { SettingsSectionId } from '../types/settings';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings01Icon,
  UserIcon,
  Notification01Icon,
  Folder01Icon,
  GitBranchIcon,
  Link01Icon,
  RocketIcon,
  FolderCodeIcon,
  FileCodeIcon,
  PaintBoardIcon,
  ShieldKeyIcon,
  Clock01Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';

interface NavSectionItem {
  id: SettingsSectionId;
  label: string;
  icon: any;
  isDanger?: boolean;
}

const navItems: NavSectionItem[] = [
  { id: 'general', label: 'General', icon: Settings01Icon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'notifications', label: 'Notifications', icon: Notification01Icon },
  { id: 'project_defaults', label: 'Project Defaults', icon: Folder01Icon },
  { id: 'github', label: 'GitHub', icon: GitBranchIcon },
  { id: 'share_portal', label: 'Share Portal', icon: Link01Icon },
  { id: 'deployments', label: 'Deployments', icon: RocketIcon },
  { id: 'storage', label: 'Storage', icon: FolderCodeIcon },
  { id: 'api', label: 'API & Infrastructure', icon: FileCodeIcon },
  { id: 'appearance', label: 'Appearance', icon: PaintBoardIcon },
  { id: 'security', label: 'Security', icon: ShieldKeyIcon },
  { id: 'backup', label: 'Backup', icon: Clock01Icon },
  { id: 'danger', label: 'Danger Zone', icon: AlertCircleIcon, isDanger: true },
];

interface SettingsSidebarProps {
  activeSection: SettingsSectionId;
  onSelectSection: (id: SettingsSectionId) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const selectedItem = navItems.find((item) => item.id === activeSection);

  return (
    <div className="w-full lg:w-64 shrink-0 font-mono select-none">
      {/* Mobile Selector with Shadcn Select */}
      <div className="lg:hidden mb-4">
        <Select
          value={activeSection}
          onValueChange={(val: any) => onSelectSection(val as SettingsSectionId)}
        >
          <SelectTrigger className="w-full h-10 px-3 rounded-lg bg-[#0c0c0e] border border-zinc-800 text-white text-xs font-mono">
            <SelectValue placeholder="Select section">
              {selectedItem?.label} {selectedItem?.isDanger ? '(Danger)' : ''}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-xs font-mono">
            {navItems.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label} {item.isDanger ? '(Danger)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Vertical Menu */}
      <div className="hidden lg:block space-y-1 p-2 rounded-xl bg-[#0c0c0e]/90 border border-zinc-800/80 shadow-xl backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`w-full h-9 px-3 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                isActive
                  ? item.isDanger
                    ? 'bg-rose-950/40 border border-rose-800/60 text-rose-400 font-bold'
                    : 'bg-zinc-800 border border-zinc-700/80 text-white font-bold shadow-md'
                  : item.isDanger
                  ? 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={item.icon}
                  size={15}
                  className={isActive ? (item.isDanger ? 'text-rose-400' : 'text-white') : 'text-zinc-500'}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.isDanger ? 'bg-rose-500' : 'bg-white'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
