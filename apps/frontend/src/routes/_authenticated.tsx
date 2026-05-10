import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { authSessionService } from '../features/authentication/services/auth-session.service';
import { useAuthStore } from '../store/auth.store';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    if (!useAuthStore.getState().isInitialized) {
      await authSessionService.initialize();
    }

    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Outlet />,
});
