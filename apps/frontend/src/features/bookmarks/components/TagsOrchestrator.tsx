import { Checkbox, Skeleton } from '@aureo/ui';

import { useTags } from '../hooks/useTags';

type TagsOrchestratorProps = {
  archived: boolean;
  activeTags: Set<string>;
  onToggleTag: (tag: string) => void;
};

const TagsSkeleton = () => (
  <div className="flex flex-col">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-2">
        <Skeleton className="size-4 shrink-0 rounded-sm" />
        <Skeleton className="h-4 flex-1 rounded-md" />
        <Skeleton className="h-5 w-7 rounded-full" />
      </div>
    ))}
  </div>
);

const TagsEmpty = () => <p className="px-3 py-2 text-sm text-custom-neutral-400">No tags yet.</p>;

export const TagsOrchestrator = ({ archived, activeTags, onToggleTag }: TagsOrchestratorProps) => {
  const { data: tags, isLoading } = useTags({ archived });

  if (isLoading) return <TagsSkeleton />;
  if (!tags?.length) return <TagsEmpty />;

  return (
    <ul aria-label="Filter by tag">
      {tags.map((tag) => (
        <li key={tag.name} className="py-0.5">
          <label className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors">
            <Checkbox
              checked={activeTags.has(tag.name)}
              onCheckedChange={() => onToggleTag(tag.name)}
            />
            <span className="flex-1 truncate font-semibold text-custom-neutral-800 leading-[140%] dark:text-custom-neutral-100">
              {tag.name}
            </span>
            <div className="border border-custom-neutral-300 rounded-full bg-custom-neutral-100 py-0.5 px-2 flex items-center dark:bg-custom-neutral-800 dark:border-custom-neutral-400">
              <span className="text-xs font-medium leading-[140%] text-custom-neutral-800 dark:text-white">
                {tag.count}
              </span>
            </div>
          </label>
        </li>
      ))}
    </ul>
  );
};
