import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="system"
    className="toaster group"
    style={{ '--offset': '24px' } as React.CSSProperties}
    toastOptions={{
      classNames: {
        toast:
          'group toast flex items-center gap-3 rounded-xl border border-custom-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-custom-neutral-900 shadow-lg dark:border-custom-neutral-500 dark:bg-custom-neutral-800 dark:text-white',
        description: 'text-custom-neutral-800 dark:text-custom-neutral-100 font-medium text-xs',
        actionButton: 'bg-custom-primary-700 text-white',
        cancelButton: 'bg-custom-neutral-100 text-custom-neutral-800',
        error:
          'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
        success:
          'border-custom-primary-700/20 bg-custom-primary-700/5 text-custom-neutral-900 dark:text-white',
      },
    }}
    {...props}
  />
);

export { Toaster };
