import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@aureo/ui';

import { useLogout } from '../../features/authentication/hooks/useLogout';
import { useUser } from '../../store/auth.store';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const user = useUser();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="flex min-h-screen items-start justify-center bg-custom-background px-4 pt-16">
      <div className="w-full max-w-md space-y-2 rounded-lg border border-custom-neutral-200 bg-white p-6 dark:border-custom-neutral-700 dark:bg-custom-neutral-900">
        <p className="text-xs font-medium uppercase tracking-widest text-custom-neutral-400">
          Logged in as
        </p>
        <p className="text-lg font-semibold text-custom-neutral-900 dark:text-white">
          {user.email}
        </p>
        <p className="text-sm text-custom-neutral-500">{user.role}</p>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => logout()}
          className="mt-4 w-full"
        >
          {isPending ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
    </div>
  );
}
