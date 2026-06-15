import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@aureo/ui';
import { ArrowDownUp, Check } from 'lucide-react';

import { SortOption } from '../types/bookmark.types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recently-added', label: 'Recently added' },
  { value: 'recently-visited', label: 'Recently visited' },
  { value: 'most-visited', label: 'Most visited' },
];

type SortDropdownProps = {
  value: SortOption;
  onChange: (sort: SortOption) => void;
};

export const SortDropdown = ({ value, onChange }: SortDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label="Sort bookmarks"
        className="flex items-center bg-white text-custom-neutral-900 border border-custom-neutral-400 gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-custom-neutral-300 dark:hover:bg-custom-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-primary-700 dark:bg-custom-neutral-800 dark:text-white dark:border-custom-neutral-400 dark:focus-visible:outline-custom-neutral-100"
      >
        <ArrowDownUp className="size-4 shrink-0" aria-hidden="true" />
        Sort By
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-44">
      {SORT_OPTIONS.map((opt) => (
        <DropdownMenuItem
          key={opt.value}
          onSelect={() => onChange(opt.value)}
          className="justify-between text-custom-neutral-800 dark:text-custom-neutral-100"
        >
          {opt.label}
          {value === opt.value && <Check className="size-4 shrink-0" aria-hidden="true" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
