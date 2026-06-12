import { Pagination } from '@aureo/ui';
import { useMemo } from 'react';

import { useDashboard } from '../context/DashboardContext';
import { BOOKMARKS_LIMIT, useBookmarks } from '../hooks/useBookmarks';
import { BookmarkCard } from './BookmarkCard';
import { BookmarksGridSkeleton } from './BookmarkCardSkeleton';

const BookmarksError = () => (
  <div className="flex flex-col items-center gap-2 py-20 text-center">
    <p className="text-sm font-medium text-custom-neutral-900 dark:text-white">
      Failed to load bookmarks
    </p>
    <p className="text-sm text-custom-neutral-400">Please try again later.</p>
  </div>
);

const BookmarksEmpty = () => (
  <div className="flex flex-col items-center gap-2 py-20 text-center">
    <p className="text-sm font-medium text-custom-neutral-900 dark:text-white">
      No bookmarks found
    </p>
    <p className="text-sm text-custom-neutral-400">Try adjusting your search or filters.</p>
  </div>
);

export const BookmarksOrchestrator = () => {
  const { searchQuery, activeTags, sortBy, page, setPage } = useDashboard();

  const query = useMemo(
    () => ({
      search: searchQuery || undefined,
      tags: activeTags.size > 0 ? Array.from(activeTags) : undefined,
      sort: sortBy,
      page,
      limit: BOOKMARKS_LIMIT,
    }),
    [searchQuery, activeTags, sortBy, page],
  );

  const { data, isLoading, isError } = useBookmarks(query);

  if (isLoading) return <BookmarksGridSkeleton count={BOOKMARKS_LIMIT} />;
  if (isError) return <BookmarksError />;

  const bookmarks = data?.data ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / (data?.limit ?? BOOKMARKS_LIMIT));

  if (bookmarks.length === 0) return <BookmarksEmpty />;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
};
