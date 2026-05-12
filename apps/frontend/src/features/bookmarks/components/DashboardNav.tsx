import { Input } from '@aureo/ui';
import { Menu, Plus, Search } from 'lucide-react';

import { AuthUser } from '../../authentication/types/auth.types';
import { useDashboard } from '../context/DashboardContext';
import { UserDropdown } from './UserDropdown';

type DashboardNavProps = {
  user: AuthUser;
  onMenuClick: () => void;
  onAddBookmark: () => void;
};

export const DashboardNav = ({ user, onMenuClick, onAddBookmark }: DashboardNavProps) => {
  const { searchQuery, setSearchQuery } = useDashboard();

  return (
    <header className="flex items-center gap-3 border-b border-custom-neutral-200 bg-white px-6 py-3 dark:border-custom-neutral-700 dark:bg-custom-neutral-900">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-custom-neutral-600 transition-colors hover:bg-custom-neutral-100 dark:text-custom-neutral-400 dark:hover:bg-custom-neutral-800 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative w-full max-w-[320px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-custom-neutral-400" />
        <Input
          placeholder="Search by title..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onAddBookmark}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-primary-700 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add Bookmark</span>
        </button>
        <UserDropdown user={user} />
      </div>
    </header>
  );
};
