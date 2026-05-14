import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@aureo/ui';

import { SortOption, useDashboard } from '../context/DashboardContext';
import { BookmarkCard } from './BookmarkCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
] as const;

export const BookmarksList = () => {
  const { bookmarks, sortBy, setSortBy } = useDashboard();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-custom-neutral-900 dark:text-white">
          All Bookmarks
          <span className="ml-2 text-sm font-normal text-custom-neutral-400">
            {bookmarks.length}
          </span>
        </h1>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="text-sm font-medium text-custom-neutral-900 dark:text-white">
            No bookmarks found
          </p>
          <p className="text-sm text-custom-neutral-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
};
