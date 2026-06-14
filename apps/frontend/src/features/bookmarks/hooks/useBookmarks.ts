import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchBookmarks } from '../api/bookmarks.api';
import { BookmarksQuery } from '../types/bookmark.types';

export const BOOKMARKS_LIMIT = 12;

export const bookmarksQueryKey = (query: BookmarksQuery) => ['bookmarks', query] as const;

export const useBookmarks = (query: BookmarksQuery) => {
  return useQuery({
    queryKey: bookmarksQueryKey(query),
    queryFn: () => fetchBookmarks(query),
    placeholderData: keepPreviousData,
  });
};
