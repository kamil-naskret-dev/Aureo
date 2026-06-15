import { useState } from 'react';

import { SortOption } from '../types/bookmark.types';

export type BookmarkListState = {
  activeTags: Set<string>;
  toggleTag: (tag: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  page: number;
  setPage: (page: number) => void;
};

export const useBookmarkListState = (): BookmarkListState => {
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('recently-added');
  const [page, setPage] = useState(1);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
    setPage(1);
  };

  const handleSetSortBy = (sort: SortOption) => {
    setSortBy(sort);
    setPage(1);
  };

  return {
    activeTags,
    toggleTag,
    sortBy,
    setSortBy: handleSetSortBy,
    page,
    setPage,
  };
};
