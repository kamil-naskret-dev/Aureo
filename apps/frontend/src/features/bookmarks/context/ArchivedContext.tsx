import { createContext, ReactNode, useContext, useState } from 'react';

type ArchivedContextValue = {
  activeTags: Set<string>;
  toggleTag: (tag: string) => void;
};

const ArchivedContext = createContext<ArchivedContextValue | null>(null);

export const ArchivedProvider = ({ children }: { children: ReactNode }) => {
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

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
  };

  return (
    <ArchivedContext.Provider value={{ activeTags, toggleTag }}>
      {children}
    </ArchivedContext.Provider>
  );
};

export const useArchived = () => {
  const ctx = useContext(ArchivedContext);
  if (!ctx) throw new Error('useArchived must be used within ArchivedProvider');
  return ctx;
};
