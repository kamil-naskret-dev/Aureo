import { Checkbox, cn } from '@aureo/ui';
import { Link, useLocation } from '@tanstack/react-router';
import { Archive, Home } from 'lucide-react';

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
        'flex w-full max-w-74 gap-4 shrink-0 flex-col border-r border-custom-neutral-300 bg-white dark:border-custom-neutral-700 dark:bg-custom-neutral-900',
        className,
      )}
    >
      <div className="pt-5 px-5 pb-2.5">
        <Logo />
      </div>

      <nav className="flex flex-col px-4">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <div key={to} className="py-0.5">
            <Link
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-sm px-3 py-2 font-semibold leading-[140%] transition-colors border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700  focus-visible:ring-offset-2',
                pathname === to
                  ? 'bg-custom-neutral-100 border-custom-neutral-100 text-custom-neutral-900'
                  : 'text-custom-neutral-800 hover:bg-custom-neutral-100 hover:text-custom-neutral-900',
              )}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-2 px-4 pb-5">
        <div className="pb-1 px-3 border-b border-transparent">
          <span className="text-xs font-bold uppercase text-custom-secondary-400 leading-[140%]">
            Tags
          </span>
        </div>

        <div className="flex flex-col">
          {DUMMY_TAGS.map((tag) => (
            <div key={tag.id} className="py-0.5">
              <label className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors">
                <Checkbox
                  checked={activeTags.has(tag.name)}
                  onCheckedChange={() => toggleTag(tag.name)}
                />
                <span className="flex-1 font-semibold text-custom-neutral-800 leading-[140%]">
                  {tag.name}
                </span>
                <div className="border border-custom-neutral-300 rounded-full bg-custom-neutral-100 py-0.5 px-2 flex items-center">
                  <span className="text-xs font-medium leading-[140%] text-custom-neutral-800">
                    {tag.count}
                  </span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
