import { Bookmark } from '../data/dummy';
import { BookmarkCardMenu } from './BookmarkCardMenu';

type BookmarkCardProps = {
  bookmark: Bookmark;
};

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-custom-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-custom-neutral-700 dark:bg-custom-neutral-900">
      <div className="flex items-start gap-3">
        <img
          src={faviconUrl}
          alt=""
          width={20}
          height={20}
          className="mt-0.5 size-5 shrink-0 rounded-sm"
        />
        <div className="min-w-0 flex-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-1 text-sm font-semibold text-custom-neutral-900 hover:text-custom-primary-700 dark:text-white"
          >
            {bookmark.title}
          </a>
          <p className="mt-0.5 line-clamp-1 text-xs text-custom-neutral-400">{bookmark.domain}</p>
        </div>
        <BookmarkCardMenu />
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-custom-neutral-800 dark:text-custom-neutral-100">
        {bookmark.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-custom-neutral-100 px-2 py-0.5 text-xs font-medium text-custom-neutral-700 dark:bg-custom-neutral-800 dark:text-custom-neutral-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-xs text-custom-neutral-400">
          {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};
