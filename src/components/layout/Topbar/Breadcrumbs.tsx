import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Home01Icon } from '@hugeicons/core-free-icons';

const ROUTE_LABELS: Record<string, string> = {
  app: 'Home',
  dashboard: 'Dashboard Overview',
  projects: 'Projects',
  clients: 'Clients',
  timeline: 'Timeline',
  milestones: 'Milestones',
  tasks: 'Tasks',
  github: 'GitHub Repositories',
  files: 'Vault Files',
  docs: 'Documentation',
  'client-portal': 'Client Portals',
  'share-links': 'Share Links',
  activity: 'Activity Log',
  notifications: 'Notifications',
  analytics: 'Analytics',
  settings: 'Settings',
  profile: 'Profile',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = ROUTE_LABELS[segment] ?? segment.replace(/-/g, ' ');
    return { url, label };
  });

  const currentPageLabel = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard';

  return (
    <div className="flex flex-col justify-center">
      {/* Current Page Title */}
      <h1 className="text-sm font-bold text-white tracking-tight capitalize leading-tight">
        {currentPageLabel}
      </h1>

      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono mt-0.5">
        <Link to="/app/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
          <HugeiconsIcon icon={Home01Icon} size={12} className="text-zinc-500" />
          <span>Home</span>
        </Link>

        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.url}>
            <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="text-zinc-600 shrink-0" />
            {idx === breadcrumbs.length - 1 ? (
              <span className="text-zinc-300 font-medium truncate max-w-[150px] capitalize">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.url} className="hover:text-white transition-colors truncate max-w-[120px] capitalize">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;
