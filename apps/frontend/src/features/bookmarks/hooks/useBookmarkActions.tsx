import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Archive, ArchiveX, Pin, PinOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  createBookmarkApi,
  deleteBookmarkApi,
  toggleArchiveApi,
  togglePinApi,
} from '../api/bookmarks.api';

export const useBookmarkActions = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] });

  const pin = useMutation({
    mutationFn: ({ id }: { id: string; pinned: boolean }) => togglePinApi(id),
    onSuccess: (_, { pinned }) => {
      toast.success(pinned ? 'Bookmark unpinned.' : 'Bookmark pinned to top.', {
        icon: pinned ? (
          <PinOff className="size-4" aria-hidden="true" />
        ) : (
          <Pin className="size-4" aria-hidden="true" />
        ),
      });
      invalidate();
    },
    onError: () => toast.error('Failed to update pin'),
  });

  const archive = useMutation({
    mutationFn: ({ id }: { id: string; archived: boolean }) => toggleArchiveApi(id),
    onSuccess: (_, { archived }) => {
      toast.success(archived ? 'Bookmark unarchived.' : 'Bookmark archived.', {
        icon: archived ? (
          <ArchiveX className="size-4" aria-hidden="true" />
        ) : (
          <Archive className="size-4" aria-hidden="true" />
        ),
      });
      invalidate();
    },
    onError: () => toast.error('Failed to archive bookmark'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteBookmarkApi(id),
    onSuccess: () => {
      toast.success('Bookmark deleted.', {
        icon: <Trash2 className="size-4" aria-hidden="true" />,
      });
      invalidate();
    },
    onError: () => toast.error('Failed to delete bookmark'),
  });

  const create = useMutation({
    mutationFn: createBookmarkApi,
    onSuccess: () => {
      toast.success('Bookmark added');
      invalidate();
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error('This URL is already in your bookmarks');
      } else {
        toast.error('Failed to add bookmark');
      }
    },
  });

  return { pin, archive, remove, create };
};
