import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@aureo/ui';

export const Route = createRootRoute({
  beforeLoad: () => {
    document.title = 'Aureo';
  },
  component: RootLayout,
  errorComponent: RootErrorBoundary,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-custom-background">
      <Outlet />
    </div>
  );
}

function RootErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-custom-background p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertTriangle
          className="size-12 text-custom-neutral-600 dark:text-custom-neutral-400"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-custom-neutral-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="text-sm text-custom-neutral-600 dark:text-custom-neutral-100">
            {error.message || 'An unexpected error occurred.'}
          </p>
        </div>
      </div>
      <Button onClick={reset} className="flex items-center gap-2">
        <RefreshCw className="size-4" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}
