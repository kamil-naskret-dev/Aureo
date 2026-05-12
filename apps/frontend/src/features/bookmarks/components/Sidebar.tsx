import { Checkbox, cn, Separator } from '@aureo/ui';
import { Link, useLocation } from '@tanstack/react-router';
import { Archive, Home, Tag } from 'lucide-react';

import Logo from '../../../assets/icons/logo.svg?react';
import { useDashboard } from '../context/DashboardContext';
import { DUMMY_TAGS } from '../data/dummy';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/dashboard/archived', label: 'Archived', icon: Archive },
] as const;

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  const { pathname } = useLocation();
  const { activeTags, toggleTag } = useDashboard();

  return (
    <aside
      className={cn(
        'flex w-[296px] shrink-0 flex-col border-r border-custom-neutral-200 bg-white dark:border-custom-neutral-700 dark:bg-custom-neutral-900',
        className,
      )}
    >
      <div className="px-6 py-5">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1 px-4 pb-4">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === to
                ? 'bg-custom-neutral-100 text-custom-neutral-900 dark:bg-custom-neutral-800 dark:text-white'
                : 'text-custom-neutral-600 hover:bg-custom-neutral-100 hover:text-custom-neutral-900 dark:text-custom-neutral-400 dark:hover:bg-custom-neutral-800 dark:hover:text-white',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <Separator />

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 px-3 py-1">
          <Tag className="size-3.5 shrink-0 text-custom-neutral-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-custom-neutral-400">
            Tags
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          {DUMMY_TAGS.map((tag) => (
            <label
              key={tag.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-custom-neutral-100 dark:hover:bg-custom-neutral-800"
            >
              <Checkbox
                checked={activeTags.has(tag.name)}
                onCheckedChange={() => toggleTag(tag.name)}
              />
              <span className="flex-1 text-sm text-custom-neutral-700 dark:text-custom-neutral-300">
                {tag.name}
              </span>
              <span className="text-xs tabular-nums text-custom-neutral-400">{tag.count}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
