import { Skeleton } from '@aureo/ui';

export const BookmarkCardSkeleton = () => (
  <div className="flex flex-col rounded-[12px] bg-white dark:bg-custom-neutral-800 shadow-[0_2px_4px_0px_#1515150F]">
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Skeleton className="size-[52px] shrink-0 rounded-[8px]" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="size-6 rounded-md" />
      </div>

      <Skeleton className="h-px w-full" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>

    <div className="border-t border-custom-neutral-300 dark:border-custom-neutral-600 px-4 py-3 flex items-center gap-4">
      <Skeleton className="h-3 w-6" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="ml-auto h-3 w-3" />
    </div>
  </div>
);

export const BookmarksGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <BookmarkCardSkeleton key={i} />
    ))}
  </div>
);
