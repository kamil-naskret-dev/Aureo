import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';

import { useDebounce } from '../../../hooks/useDebounce';

type SearchContextValue = {
  searchQuery: string;
  debouncedSearchQuery: string;
  setSearchQuery: (q: string) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { pathname } = useLocation();

  useEffect(() => {
    setSearchQuery('');
  }, [pathname]);

  return (
    <SearchContext.Provider value={{ searchQuery, debouncedSearchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextValue => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
};
