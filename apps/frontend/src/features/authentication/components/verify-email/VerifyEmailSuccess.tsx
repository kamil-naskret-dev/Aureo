import { CardDescription, CardTitle } from '@aureo/ui';
import { Link } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';

export const VerifyEmailSuccess = () => {
  return (
    <>
      <CheckCircle className="size-10 text-custom-primary-700" />
      <div className="flex flex-col gap-1.5">
        <CardTitle>Email verified!</CardTitle>
        <CardDescription>Your account is now active. You can log in.</CardDescription>
      </div>
      <Link
        to="/"
        className="text-sm font-semibold text-custom-neutral-900 hover:text-custom-primary-700 dark:text-white"
      >
        Go to log in
      </Link>
    </>
  );
};
