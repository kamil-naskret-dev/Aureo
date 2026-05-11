import { Link } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';

export const ResetPasswordSuccess = () => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <CheckCircle className="size-10 text-custom-primary-700" />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-custom-neutral-900 dark:text-white">
          Password reset!
        </p>
        <p className="text-sm text-custom-neutral-800 dark:text-custom-neutral-100">
          Your password has been updated. You can now log in with your new password.
        </p>
      </div>
      <Link
        to="/"
        className="text-sm font-semibold text-custom-neutral-900 hover:text-custom-primary-700 dark:text-white"
      >
        Go to log in
      </Link>
    </div>
  );
};
