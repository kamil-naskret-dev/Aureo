import { createContext, ReactNode, useContext } from 'react';

import { BookmarkListState, useBookmarkListState } from '../hooks/useBookmarkListState';

const ArchivedContext = createContext<BookmarkListState | null>(null);

export const ArchivedProvider = ({ children }: { children: ReactNode }) => {
  const state = useBookmarkListState();

  return <ArchivedContext.Provider value={state}>{children}</ArchivedContext.Provider>;
};

export const useArchived = (): BookmarkListState => {
  const ctx = useContext(ArchivedContext);
  if (!ctx) throw new Error('useArchived must be used within ArchivedProvider');
  return ctx;
};
