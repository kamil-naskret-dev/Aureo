import { useQuery } from '@tanstack/react-query';

import { fetchTagsApi } from '../api/bookmarks.api';

type UseTagsOptions = {
  archived: boolean;
};

export const tagsQueryKey = (archived: boolean) => ['tags', { archived }] as const;

export const useTags = ({ archived }: UseTagsOptions) => {
  return useQuery({
    queryKey: tagsQueryKey(archived),
    queryFn: () => fetchTagsApi(archived),
    staleTime: 60_000,
  });
};
