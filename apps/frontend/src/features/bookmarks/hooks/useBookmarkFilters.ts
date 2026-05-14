import { useMemo, useState } from 'react';

import { SortOption } from '../../../routes/_authenticated/dashboard';
import { DUMMY_BOOKMARKS } from '../data/dummy';

export const useBookmarkFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const toggleTag = (tagName: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tagName)) {
        next.delete(tagName);
      } else {
        next.add(tagName);
      }
      return next;
    });
  };

  const bookmarks = useMemo(() => {
    let result = DUMMY_BOOKMARKS;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => b.title.toLowerCase().includes(q));
    }

    if (activeTags.size > 0) {
      result = result.filter((b) => b.tags.some((tag) => activeTags.has(tag)));
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest')
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [searchQuery, activeTags, sortBy]);

  return { bookmarks, searchQuery, setSearchQuery, activeTags, toggleTag, sortBy, setSortBy };
};
