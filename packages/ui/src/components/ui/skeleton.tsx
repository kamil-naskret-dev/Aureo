import { cn } from '../../lib/utils';

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-custom-neutral-100 dark:bg-custom-neutral-600',
      className,
    )}
    {...props}
  />
);

export { Skeleton };
