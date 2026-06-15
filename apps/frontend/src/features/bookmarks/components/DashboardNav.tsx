import { Button, Input } from '@aureo/ui';
import { Menu, Plus, Search } from 'lucide-react';

import { AuthUser } from '../../authentication/types/auth.types';
import { useSearch } from '../context/SearchContext';
import { UserDropdown } from './UserDropdown';

type DashboardNavProps = {
  user: AuthUser;
  onMenuClick: () => void;
  onAddBookmark: () => void;
};

export const DashboardNav = ({ user, onMenuClick, onAddBookmark }: DashboardNavProps) => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="flex items-center gap-3 border-b border-custom-neutral-300 bg-white dark:bg-custom-neutral-800 py-3 px-4 sm:px-8 sm:py-4 dark:border-custom-neutral-500">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="size-11 shrink-0 text-custom-neutral-600 lg:hidden dark:text-white dark:bg-custom-neutral-800"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <div className="relative min-w-0 flex-1 max-w-[320px]">
        <Search
          className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-custom-neutral-800 dark:text-custom-neutral-100"
          aria-hidden="true"
        />
        <Input
          aria-label="Search bookmarks"
          placeholder="Search by title..."
          className="p-3 pl-10 font-medium text-sm leading-[150%] tracking-[1%] text-custom-neutral-800 border-custom-neutral-300 h-10 sm:h-11.25 dark:bg-custom-neutral-600 dark:text-custom-neutral-100 dark:placeholder:text-custom-neutral-100 dark:border-custom-neutral-500 dark:hover:bg-custom-neutral-500 dark:hover:border-custom-neutral-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-4">
        <Button size="cta" onClick={onAddBookmark} className="flex items-center gap-1">
          <Plus className="size-5" aria-hidden="true" />
          <span className="hidden sm:inline">Add Bookmark</span>
        </Button>
        <UserDropdown user={user} />
      </div>
    </header>
  );
};
