import { createFileRoute, redirect } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aureo/ui';
import { useState } from 'react';
import Logo from './../assets/icons/logo.svg?react';
import { RegisterActions, RegisterForm, RegisterSuccess } from '../features/authentication';
import { useAuthStore } from '../store/auth.store';

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-custom-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Logo className="mb-8" />
          {!successEmail && (
            <div className="flex flex-col gap-1.5">
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Get started today! Please fill in your details.</CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {successEmail ? (
            <RegisterSuccess email={successEmail} />
          ) : (
            <>
              <RegisterForm onSuccess={setSuccessEmail} />
              <RegisterActions />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
