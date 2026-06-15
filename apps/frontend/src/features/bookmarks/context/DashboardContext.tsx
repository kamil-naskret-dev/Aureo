import { createContext, ReactNode, useContext } from 'react';

import { BookmarkListState, useBookmarkListState } from '../hooks/useBookmarkListState';

const DashboardContext = createContext<BookmarkListState | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const state = useBookmarkListState();

  return <DashboardContext.Provider value={state}>{children}</DashboardContext.Provider>;
};

export const useDashboard = (): BookmarkListState => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};
