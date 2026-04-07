import { createFileRoute } from '@tanstack/react-router';

import { LoginForm } from '../features/authentication/components/LoginForm';

export const Route = createFileRoute('/')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-custom-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your Aureo account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
