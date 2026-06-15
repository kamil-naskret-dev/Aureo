import { cn } from '@aureo/ui';
import { Link, useLocation } from '@tanstack/react-router';
import { Archive, Home } from 'lucide-react';

import Logo from '../../../assets/icons/logo.svg?react';
import { useArchived } from '../context/ArchivedContext';
import { useDashboard } from '../context/DashboardContext';
import { TagsOrchestrator } from './TagsOrchestrator';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/dashboard/archived', label: 'Archived', icon: Archive },
] as const;

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  const { pathname } = useLocation();
  const isArchived = pathname === '/dashboard/archived';

  const dashboard = useDashboard();
  const archived = useArchived();

  const activeTags = isArchived ? archived.activeTags : dashboard.activeTags;
  const toggleTag = isArchived ? archived.toggleTag : dashboard.toggleTag;

  return (
    <aside
      className={cn(
        'flex w-full max-w-74 gap-4 shrink-0 flex-col border-r border-custom-neutral-300 bg-white dark:border-custom-neutral-500 dark:bg-custom-neutral-800',
        className,
      )}
    >
      <div className="pt-5 px-5 pb-2.5">
        <Logo aria-label="Bookmark Manager" />
      </div>

      <nav className="flex flex-col px-4">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <div key={to} className="py-0.5">
            <Link
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-sm px-3 py-2 font-semibold leading-[140%] transition-colors border border-transparent outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 focus-visible:ring-offset-2',
                pathname === to
                  ? 'bg-custom-neutral-100 border-custom-neutral-100 text-custom-neutral-900 dark:bg-custom-neutral-600 dark:border-transparent dark:text-white'
                  : 'text-custom-neutral-800 hover:bg-custom-neutral-100 hover:text-custom-neutral-900 dark:bg-custom-neutral-800 dark:text-custom-neutral-100 dark:hover:bg-custom-neutral-600 dark:hover:border-transparent dark:hover:text-white',
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-5">
        <div className="pb-1 px-3 border-b border-transparent">
          <span className="text-xs font-bold uppercase text-custom-secondary-400 leading-[140%] dark:text-custom-neutral-100">
            Tags
          </span>
        </div>

        <div className="flex flex-col overflow-y-auto">
          <TagsOrchestrator archived={isArchived} activeTags={activeTags} onToggleTag={toggleTag} />
        </div>
      </div>
    </aside>
  );
};
