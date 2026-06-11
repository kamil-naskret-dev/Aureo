import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@aureo/ui';
import { ArrowDownUp, Check } from 'lucide-react';

import { useDashboard } from '../context/DashboardContext';
import { SortOption } from '../types/bookmark.types';
import { BookmarksOrchestrator } from './BookmarksOrchestrator';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recently-added', label: 'Recently added' },
  { value: 'recently-visited', label: 'Recently visited' },
  { value: 'most-visited', label: 'Most visited' },
];

export const BookmarksList = () => {
  const { sortBy, setSortBy } = useDashboard();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-custom-neutral-900 dark:text-white">
          All Bookmarks
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center bg-white text-custom-neutral-900 border border-custom-neutral-400 gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-custom-neutral-300 dark:hover:bg-custom-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-primary-700 dark:bg-custom-neutral-800 dark:text-white dark:border-custom-neutral-400 dark:focus-visible:outline-custom-neutral-100"
            >
              <ArrowDownUp className="size-4 shrink-0" />
              Sort By
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onSelect={() => setSortBy(opt.value)}
                className="justify-between text-custom-neutral-800 dark:text-custom-neutral-100"
              >
                {opt.label}
                {sortBy === opt.value && <Check className="size-4 shrink-0" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <BookmarksOrchestrator />
    </div>
  );
};
