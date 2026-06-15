import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@aureo/ui';
import {
  Archive,
  ArchiveX,
  Copy,
  MoreVertical,
  Pin,
  PinOff,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { useBookmarkActions } from '../hooks/useBookmarkActions';
import { BookmarkResponse } from '../types/bookmark.types';
import { isSafeUrl } from '../utils/isSafeUrl';

type BookmarkCardMenuProps = {
  bookmark: BookmarkResponse;
};

export const BookmarkCardMenu = ({ bookmark }: BookmarkCardMenuProps) => {
  const { pin, archive, remove } = useBookmarkActions();
  const isPinned = bookmark.state?.pinned ?? false;
  const isArchived = bookmark.state?.archived ?? false;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      toast.success('Link copied to clipboard.', {
        icon: <Copy className="size-5" aria-hidden="true" />,
      });
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex size-8 border border-custom-neutral-400 items-center justify-center rounded-md text-custom-neutral-400 transition-colors hover:bg-custom-neutral-100 hover:text-custom-neutral-700 dark:hover:bg-custom-neutral-600 dark:hover:text-custom-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 dark:focus-visible:ring-custom-neutral-100"
            aria-label="Bookmark options"
          >
            <MoreVertical className="size-5" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild disabled={!isSafeUrl(bookmark.url)}>
            <a
              href={isSafeUrl(bookmark.url) ? bookmark.url : undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SquareArrowOutUpRight aria-hidden="true" />
              Visit
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={handleCopyUrl}>
            <Copy aria-hidden="true" />
            Copy URL
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => pin.mutate({ id: bookmark.id, pinned: isPinned })}
            disabled={pin.isPending}
          >
            {isPinned ? <PinOff aria-hidden="true" /> : <Pin aria-hidden="true" />}
            {isPinned ? 'Unpin' : 'Pin'}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => archive.mutate({ id: bookmark.id, archived: isArchived })}
            disabled={archive.isPending}
          >
            {isArchived ? <ArchiveX aria-hidden="true" /> : <Archive aria-hidden="true" />}
            {isArchived ? 'Unarchive' : 'Archive'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete bookmark?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-custom-neutral-900 dark:text-white break-words">
              {bookmark.title}
            </span>{' '}
            will be permanently deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => remove.mutate(bookmark.id)} disabled={remove.isPending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
