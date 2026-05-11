import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@aureo/ui';
import { type ReactNode } from 'react';
import Logo from './../assets/icons/logo.svg?react';

import {
  useVerifyEmail,
  VerifyEmailError,
  VerifyEmailLoading,
  VerifyEmailSuccess,
} from '../features/authentication';

export const Route = createFileRoute('/verify-email')({
  validateSearch: (search) => ({
    token: (search.token as string) ?? '',
  }),
  component: VerifyEmailPage,
});

type StatusKey = 'loading' | 'success' | 'error';

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  const { isPending, isSuccess, error } = useVerifyEmail(token);

  const statusKey: StatusKey =
    !token || (!isPending && !isSuccess) ? 'error' : isPending ? 'loading' : 'success';

  const errorMessage = !token
    ? 'Verification link is invalid or missing a token.'
    : ((error as Error)?.message ?? 'Something went wrong. Please try again.');

  const statusComponents: Record<StatusKey, ReactNode> = {
    loading: <VerifyEmailLoading />,
    success: <VerifyEmailSuccess />,
    error: <VerifyEmailError message={errorMessage} />,
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-custom-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Logo className="mb-8" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          {statusComponents[statusKey]}
        </CardContent>
      </Card>
    </div>
  );
}
