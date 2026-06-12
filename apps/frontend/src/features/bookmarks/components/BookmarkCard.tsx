import { DropdownMenuSeparator } from '@aureo/ui';
import { Calendar, Clock, Eye, Pin } from 'lucide-react';

import { BookmarkResponse } from '../types/bookmark.types';
import { BookmarkCardMenu } from './BookmarkCardMenu';

type BookmarkCardProps = {
  bookmark: BookmarkResponse;
};

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=48`;
  const isPinned = bookmark.state?.pinned ?? false;

  return (
    <div className="flex flex-col rounded-[12px] bg-white dark:bg-custom-neutral-800 shadow-[0_2px_4px_0px_#1515150F]">
      <div className="p-4 flex flex-col gap-4 grow">
        <div className="flex items-start gap-3">
          <div className="border border-neutral-custom-100 rounded-[8px] p-1 dark:border-custom-neutral-500">
            <img
              src={faviconUrl}
              alt={bookmark.domain}
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-sm"
            />
          </div>
          <div className="min-w-0 flex-1 flex flex-col gap-1">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit line-clamp-1 text-xl font-bold text-custom-neutral-900 hover:text-custom-neutral-800 dark:text-white outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 focus-visible:ring-offset-2 dark:focus-visible:ring-custom-neutral-100 dark:focus-visible:ring-offset-neutral-900"
            >
              {bookmark.title}
            </a>
            <p className="line-clamp-1 text-xs font-medium leading-[140%] text-custom-neutral-800 dark:text-custom-neutral-100">
              {bookmark.domain}
            </p>
          </div>
          <BookmarkCardMenu bookmark={bookmark} />
        </div>

        <DropdownMenuSeparator />

        <div className="flex flex-col gap-4 grow">
          <p className="text-sm leading-relaxed font-medium tracking-[1%] text-custom-neutral-800 dark:text-custom-neutral-100">
            {bookmark.description}
          </p>

          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {bookmark.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-[4px] bg-custom-neutral-100 px-2 py-0.5 text-xs font-medium leading-[140%] text-custom-neutral-800 dark:bg-custom-neutral-600 dark:text-custom-neutral-100"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-custom-neutral-300">
        <ul className="py-3 px-4 flex items-center gap-4">
          <li className="flex items-center gap-1.5 text-custom-neutral-800 dark:text-custom-neutral-100">
            <Eye className="size-3.5" aria-hidden="true" />
            <span className="font-medium text-xs leading-[140%]">{bookmark.views}</span>
          </li>
          <li className="flex items-center gap-1.5 text-custom-neutral-800 dark:text-custom-neutral-100">
            <Clock className="size-3.5" aria-hidden="true" />
            <span className="font-medium text-xs leading-[140%]">
              {new Date(bookmark.updatedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </li>
          <li className="flex items-center gap-1.5 text-custom-neutral-800 dark:text-custom-neutral-100">
            <Calendar className="size-3.5" aria-hidden="true" />
            <span className="font-medium text-xs leading-[140%]">
              {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </li>
          {isPinned && (
            <li className="ml-auto" aria-label="Pinned">
              <Pin className="size-3.5" aria-hidden="true" />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
