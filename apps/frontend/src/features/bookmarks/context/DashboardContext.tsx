import { createContext, ReactNode, useContext } from 'react';

import { useBookmarkFilters } from '../hooks/useBookmarkFilters';
import { Bookmark } from '../data/dummy';
import { SortOption } from '../../../routes/_authenticated/dashboard';

type DashboardContextValue = ReturnType<typeof useBookmarkFilters>;

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const filters = useBookmarkFilters();
  return <DashboardContext.Provider value={filters}>{children}</DashboardContext.Provider>;
};

export const useDashboard = (): DashboardContextValue => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};

export type { Bookmark, SortOption };
