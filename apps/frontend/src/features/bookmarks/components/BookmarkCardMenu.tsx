import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@aureo/ui';
import { Archive, Copy, MoreVertical, Pencil, PinOff, SquareArrowOutUpRight } from 'lucide-react';

export const BookmarkCardMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-8 border border-custom-neutral-400 items-center justify-center rounded-md text-custom-neutral-400 transition-colors hover:bg-custom-neutral-100 hover:text-custom-neutral-700 dark:hover:bg-custom-neutral-800 dark:hover:text-custom-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 dark:focus-visible:ring-custom-neutral-100"
          aria-label="Bookmark options"
        >
          <MoreVertical className="size-5" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-50">
        <DropdownMenuItem>
          <SquareArrowOutUpRight />
          Visit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          Copy URL
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PinOff />
          Unpin
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Archive />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
