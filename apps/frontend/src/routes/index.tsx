import { createFileRoute, redirect } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aureo/ui';
import Logo from './../assets/icons/logo.svg?react';
import { LoginActions, LoginForm } from '../features/authentication';
import { useAuthStore } from '../store/auth.store';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-custom-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Logo className="mb-8" />
          <div className="flex flex-col gap-1.5">
            <CardTitle>Log in to your account</CardTitle>
            <CardDescription>Welcome back! Please enter your details.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <LoginForm />
          <LoginActions />
        </CardContent>
      </Card>
    </div>
  );
}
