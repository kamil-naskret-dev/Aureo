import { Link } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

export const ResetPasswordInvalidLink = () => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <AlertCircle className="size-10 text-destructive" />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-custom-neutral-900 dark:text-white">
          Invalid reset link
        </p>
        <p className="text-sm text-custom-neutral-800 dark:text-custom-neutral-100">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
      </div>
      <Link
        to="/forgot-password"
        className="text-sm font-semibold text-custom-neutral-900 hover:text-custom-primary-700 dark:text-white"
      >
        Request a new link
      </Link>
    </div>
  );
};
