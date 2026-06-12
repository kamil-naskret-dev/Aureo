import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteBookmarkApi, toggleArchiveApi, togglePinApi } from '../api/bookmarks.api';

export const useBookmarkActions = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] });

  const pin = useMutation({
    mutationFn: ({ id }: { id: string; pinned: boolean }) => togglePinApi(id),
    onSuccess: (_, { pinned }) => {
      toast.success(pinned ? 'Bookmark unpinned' : 'Bookmark pinned');
      invalidate();
    },
    onError: () => toast.error('Failed to update pin'),
  });

  const archive = useMutation({
    mutationFn: ({ id }: { id: string; archived: boolean }) => toggleArchiveApi(id),
    onSuccess: (_, { archived }) => {
      toast.success(archived ? 'Bookmark unarchived' : 'Bookmark archived');
      invalidate();
    },
    onError: () => toast.error('Failed to archive bookmark'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteBookmarkApi(id),
    onSuccess: () => {
      toast.success('Bookmark deleted');
      invalidate();
    },
    onError: () => toast.error('Failed to delete bookmark'),
  });

  return { pin, archive, remove };
};
