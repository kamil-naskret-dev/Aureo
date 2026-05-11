import { Link } from '@tanstack/react-router';
import { MailCheck } from 'lucide-react';

type ForgotPasswordSuccessProps = {
  email: string;
};

export const ForgotPasswordSuccess = ({ email }: ForgotPasswordSuccessProps) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <MailCheck className="size-10 text-custom-primary-700" />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-custom-neutral-900 dark:text-white">
          Check your email
        </p>
        <p className="text-sm text-custom-neutral-800 dark:text-custom-neutral-100">
          We sent a password reset link to{' '}
          <span className="font-semibold text-custom-neutral-900 dark:text-white">{email}</span>.
          Click the link to reset your password.
        </p>
      </div>
      <Link
        to="/"
        className="text-sm font-semibold text-custom-neutral-900 hover:text-custom-primary-700 dark:text-white"
      >
        Back to log in
      </Link>
    </div>
  );
};
