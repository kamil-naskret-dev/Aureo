import { createFileRoute, Link } from '@tanstack/react-router';

import { LoginForm } from '../features/authentication/components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aureo/ui';

export const Route = createFileRoute('/')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-custom-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <img src="/icons/logo.svg" alt="Aureo" width={214} height={32} className="mb-8" />
          <div className="flex flex-col gap-1.5">
            <CardTitle>Log in to your account</CardTitle>
            <CardDescription>Welcome back! Please enter your details.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <LoginForm />
          <div className="flex flex-col gap-3 items-center">
            <p className="flex gap-1.5 text-custom-neutral-800 text-sm font-medium tracking-[1%] leading-[150%]">
              Forgot password?
              <Link
                to="/reset-password"
                className="rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 font-semibold text-custom-neutral-900 tracking-normal leading-[140%] hover:text-custom-primary-700"
              >
                Reset it
              </Link>
            </p>
            <p className="flex gap-1.5 text-custom-neutral-800 text-sm font-medium tracking-[1%] leading-[150%]">
              Don&apos;t have an account?
              <Link
                to="/sign-up"
                className="rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 font-semibold text-custom-neutral-900 tracking-normal leading-[140%] hover:text-custom-primary-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
