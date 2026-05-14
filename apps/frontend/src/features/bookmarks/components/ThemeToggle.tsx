import { Moon, Sun } from 'lucide-react';

type ThemeToggleProps = {
  isDark: boolean;
};

export const ThemeToggle = ({ isDark }: ThemeToggleProps) => (
  <div className="relative inline-flex items-center rounded-xl bg-custom-neutral-100 dark:bg-custom-neutral-800 border border-custom-neutral-200 dark:border-custom-neutral-700 p-1">
    <span
      className={`relative z-10 flex items-center justify-center size-8 rounded-lg transition-colors duration-200 ${!isDark ? 'text-custom-neutral-900' : 'text-custom-neutral-400'}`}
    >
      <Sun className="size-4" />
    </span>
    <span
      className={`relative z-10 flex items-center justify-center size-8 rounded-lg transition-colors duration-200 ${isDark ? 'text-custom-neutral-900 dark:text-white' : 'text-custom-neutral-400'}`}
    >
      <Moon className="size-4" />
    </span>
    <span
      className={`pointer-events-none absolute top-1 size-8 rounded-lg bg-white dark:bg-custom-neutral-900 shadow-sm border border-custom-neutral-200 dark:border-custom-neutral-600 transition-transform duration-200 ease-in-out ${isDark ? 'translate-x-full' : 'translate-x-0'}`}
      style={{ left: '4px' }}
    />
  </div>
);
