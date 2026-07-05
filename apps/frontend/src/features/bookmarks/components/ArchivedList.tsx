import { useEffect } from 'react';

import { useArchived } from '../context/ArchivedContext';
import { useSearch } from '../context/SearchContext';
import { BookmarksOrchestrator } from './BookmarksOrchestrator';
import { SortDropdown } from './SortDropdown';

export const ArchivedList = () => {
  const { debouncedSearchQuery } = useSearch();
  const { activeTags, sortBy, setSortBy, page, setPage } = useArchived();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, setPage]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-custom-neutral-900 dark:text-white">Archived</h1>
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      <BookmarksOrchestrator
        searchQuery={debouncedSearchQuery}
        activeTags={activeTags}
        sortBy={sortBy}
        page={page}
        onPageChange={setPage}
        archived={true}
      />
    </div>
  );
};
