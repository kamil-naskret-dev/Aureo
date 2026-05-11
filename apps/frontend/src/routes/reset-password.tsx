import { createFileRoute, redirect } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aureo/ui';
import { useState } from 'react';
import Logo from './../assets/icons/logo.svg?react';
import {
  ResetPasswordForm,
  ResetPasswordInvalidLink,
  ResetPasswordSuccess,
} from '../features/authentication';
import { useAuthStore } from '../store/auth.store';

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search) => ({
    token: (search.token as string) ?? '',
  }),
  beforeLoad: async () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const [isSuccess, setIsSuccess] = useState(false);

  const showHeader = !!token && !isSuccess;

  return (
    <div className="flex min-h-screen items-center justify-center bg-custom-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Logo className="mb-8" />
          {showHeader && (
            <div className="flex flex-col gap-1.5">
              <CardTitle>Set new password</CardTitle>
              <CardDescription>Your new password must be at least 8 characters.</CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {!token && <ResetPasswordInvalidLink />}
          {token &&
            (isSuccess ? (
              <ResetPasswordSuccess />
            ) : (
              <ResetPasswordForm token={token} onSuccess={() => setIsSuccess(true)} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
