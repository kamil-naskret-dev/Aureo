import { createContext, ReactNode, useContext, useState } from 'react';

import { SortOption } from '../types/bookmark.types';

type DashboardContextValue = {
  activeTags: Set<string>;
  toggleTag: (tag: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  page: number;
  setPage: (page: number) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <DashboardContext.Provider
      value={{
        activeTags,
        toggleTag,
        sortBy,
        setSortBy: handleSetSortBy,
        page,
        setPage,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextValue => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};
