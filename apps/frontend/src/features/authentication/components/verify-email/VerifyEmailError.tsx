import { CardDescription, CardTitle } from '@aureo/ui';
import { Link } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

type VerifyEmailErrorProps = {
  message: string;
};

export const VerifyEmailError = ({ message }: VerifyEmailErrorProps) => {
  return (
    <>
      <AlertCircle className="size-10 text-destructive" />
      <div className="flex flex-col gap-1.5">
        <CardTitle>Verification failed</CardTitle>
        <CardDescription>{message}</CardDescription>
      </div>
      <Link
        to="/"
        className="text-sm font-semibold text-custom-neutral-900 hover:text-custom-primary-700 dark:text-white"
      >
        Back to log in
      </Link>
    </>
  );
};
