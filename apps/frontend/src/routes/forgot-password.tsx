import { createFileRoute, redirect } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aureo/ui';
import { useState } from 'react';
import Logo from './../assets/icons/logo.svg?react';
import {
  ForgotPasswordActions,
  ForgotPasswordForm,
  ForgotPasswordSuccess,
} from '../features/authentication';
import { useAuthStore } from '../store/auth.store';

export const Route = createFileRoute('/forgot-password')({
  beforeLoad: async () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-custom-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Logo className="mb-8" />
          {!successEmail && (
            <div className="flex flex-col gap-1.5">
              <CardTitle>Forgot your password?</CardTitle>
              <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {successEmail ? (
            <ForgotPasswordSuccess email={successEmail} />
          ) : (
            <>
              <ForgotPasswordForm onSuccess={setSuccessEmail} />
              <ForgotPasswordActions />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
