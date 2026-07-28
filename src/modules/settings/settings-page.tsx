import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { SettingsSectionId } from './types/settings';
import { SettingsSidebar } from './components/settings-sidebar';
import { SettingsSection } from './components/settings-section';
import { GeneralSettingsSection } from './components/general-settings';
import { ProfileSettingsSection } from './components/profile-settings';
import { NotificationSettingsSection } from './components/notification-settings';
import { ProjectSettingsSection } from './components/project-settings';
import { GitHubSettingsSection } from './components/github-settings';
import { SharePortalSettingsSection } from './components/share-portal-settings';
import { DeploymentSettingsSection } from './components/deployment-settings';
import { StorageSettingsSection } from './components/storage-settings';
import { APISettingsSection } from './components/api-settings';
import { AppearanceSettingsSection } from './components/appearance-settings';
import { SecuritySettingsSection } from './components/security-settings';
import { BackupSettingsSection } from './components/backup-settings';
import { SettingsDangerZone } from './components/settings-danger-zone';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Settings01Icon } from '@hugeicons/core-free-icons';

interface SectionMeta {
  id: SettingsSectionId;
  title: string;
  description: string;
  keywords: string[];
  component: React.ReactNode;
}

export const SettingsModulePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as SettingsSectionId | null;
  const [activeSection, setActiveSection] = useState<SettingsSectionId>(tabParam || 'general');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (tabParam) {
      setActiveSection(tabParam);
    }
  }, [tabParam]);

  const sections: SectionMeta[] = useMemo(
    () => [
      {
        id: 'general',
        title: 'General Settings',
        description: 'Configure system identity, environment, date formats, and editor preferences.',
        keywords: ['general', 'identity', 'environment', 'timezone', 'date', 'currency', 'autosave', 'markdown'],
        component: <GeneralSettingsSection />,
      },
      {
        id: 'profile',
        title: 'Profile Settings',
        description: 'Manage administrator avatar, bio, developer profile, and agency details.',
        keywords: ['profile', 'avatar', 'name', 'email', 'bio', 'company', 'website', 'github'],
        component: <ProfileSettingsSection />,
      },
      {
        id: 'notifications',
        title: 'Notification Settings',
        description: 'Complete notification center across in-app, email, and browser push alerts.',
        keywords: ['notifications', 'email', 'push', 'browser', 'alerts', 'events', 'projects', 'payments', 'deployments'],
        component: <NotificationSettingsSection />,
      },
      {
        id: 'project_defaults',
        title: 'Project Defaults',
        description: 'Preset status, priority, visibility, and sorting rules for new projects.',
        keywords: ['projects', 'defaults', 'status', 'priority', 'visibility', 'currency'],
        component: <ProjectSettingsSection />,
      },
      {
        id: 'github',
        title: 'GitHub Integration',
        description: 'Manage GitHub OAuth connection, branch rules, and repository auto-sync.',
        keywords: ['github', 'oauth', 'sync', 'branch', 'issues', 'pull requests', 'webhook'],
        component: <GitHubSettingsSection />,
      },
      {
        id: 'share_portal',
        title: 'Share Portal Settings',
        description: 'Configure share link expiration, password requirements, and client tab visibility.',
        keywords: ['share', 'portal', 'link', 'password', 'expiration', 'client', 'privacy', 'redaction'],
        component: <SharePortalSettingsSection />,
      },
      {
        id: 'deployments',
        title: 'Deployment Settings',
        description: 'Set default environment, hosting provider, and automated health checks.',
        keywords: ['deployments', 'hosting', 'vercel', 'netlify', 'health', 'provider', 'refresh'],
        component: <DeploymentSettingsSection />,
      },
      {
        id: 'storage',
        title: 'Storage Settings',
        description: 'Live storage capacity and utilization across project files and assets.',
        keywords: ['storage', 'bucket', 'vault', 'files', 'invoices', 'docs', 'capacity'],
        component: <StorageSettingsSection />,
      },
      {
        id: 'api',
        title: 'API & Infrastructure',
        description: 'Supabase Database, Edge Functions, Auth, and Realtime service monitor.',
        keywords: ['api', 'supabase', 'database', 'edge functions', 'realtime', 'auth'],
        component: <APISettingsSection />,
      },
      {
        id: 'appearance',
        title: 'Appearance & Theme Engine',
        description: 'Customize Liquid Glass intensity, compact grids, and animation settings.',
        keywords: ['appearance', 'theme', 'dark', 'glass', 'compact', 'animations', 'monochrome'],
        component: <AppearanceSettingsSection />,
      },
      {
        id: 'security',
        title: 'Security Settings',
        description: 'Session timeout, two-factor authentication, and active browser sessions.',
        keywords: ['security', '2fa', 'session', 'jwt', 'auth', 'login', 'logout'],
        component: <SecuritySettingsSection />,
      },
      {
        id: 'backup',
        title: 'Backup & Restore',
        description: 'Database backup snapshots, retention schedules, and JSON settings export.',
        keywords: ['backup', 'restore', 'snapshot', 'export', 'import', 'json'],
        component: <BackupSettingsSection />,
      },
      {
        id: 'danger',
        title: 'Danger Zone',
        description: 'Irreversible application operations, cache clearing, and system resets.',
        keywords: ['danger', 'clear', 'cache', 'reset', 'delete', 'reset preferences'],
        component: <SettingsDangerZone />,
      },
    ],
    []
  );

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase().trim();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.description.toLowerCase().includes(q) ||
        sec.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [sections, searchQuery]);

  const currentSection =
    sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full max-w-[1600px] mx-auto space-y-5 text-zinc-100 select-none pb-12 font-mono"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
            <HugeiconsIcon icon={Settings01Icon} size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-sans tracking-tight">System Settings & Administration</h1>
            <p className="text-xs text-zinc-500 font-sans">
              Centralized administration panel for workspace preferences, integrations, security, and notifications.
            </p>
          </div>
        </div>

        {/* Search Settings Bar */}
        <div className="relative w-full sm:w-72">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            className="absolute left-3 top-2.5 text-zinc-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#0c0c0e] border border-zinc-800 focus:border-zinc-600 text-white text-xs placeholder-zinc-500 font-mono outline-none transition-colors"
          />
        </div>
      </div>

      {/* Main Layout: Sidebar + Section Content */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Sidebar */}
        <SettingsSidebar
          activeSection={activeSection}
          onSelectSection={(id) => {
            setActiveSection(id);
            setSearchQuery('');
          }}
        />

        {/* Content Area */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {searchQuery.trim() ? (
            <div className="space-y-6">
              <div className="text-xs text-zinc-400 font-mono">
                Found {filteredSections.length} matching settings {filteredSections.length === 1 ? 'section' : 'sections'} for "{searchQuery}":
              </div>
              {filteredSections.map((sec) => (
                <SettingsSection key={sec.id} id={sec.id} title={sec.title} description={sec.description}>
                  {sec.component}
                </SettingsSection>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <SettingsSection
                key={currentSection.id}
                id={currentSection.id}
                title={currentSection.title}
                description={currentSection.description}
              >
                {currentSection.component}
              </SettingsSection>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsModulePage;
