import * as React from 'react';

import { cn } from '@aureo/ui/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        aria-invalid={ariaInvalid}
        className={cn(
          'cursor-pointer font-medium leading-[150%] tracking-[1%] flex h-11.25 w-full rounded-md border border-custom-neutral-500 bg-transparent px-3 py-2 text-sm text-custom-neutral-900  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700  focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-custom-neutral-600 dark:border-custom-neutral-300 hover:bg-custom-neutral-100 ',
          ariaInvalid && 'border-red-500 focus-visible:ring-red-500',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
