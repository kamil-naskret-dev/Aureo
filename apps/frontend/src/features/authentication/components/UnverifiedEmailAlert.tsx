import { Spinner } from '@aureo/ui';
import { AlertCircle, CheckCircle } from 'lucide-react';

import { useResendVerification } from '../hooks/useResendVerification';

type UnverifiedEmailAlertProps = {
  email: string;
};

export const UnverifiedEmailAlert = ({ email }: UnverifiedEmailAlertProps) => {
  const {
    mutateAsync: resendVerification,
    isPending: isResending,
    isSuccess: isResent,
  } = useResendVerification();

  const handleResend = async () => {
    await resendVerification({ email });
  };

  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>Please verify your email before logging in.</span>
      </div>
      {isResent ? (
        <div className="flex items-center gap-1.5 pl-6.5 text-custom-neutral-800 dark:text-custom-neutral-100">
          <CheckCircle className="size-3.5 shrink-0" />
          <span>Verification email sent.</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="flex items-center gap-1.5 pl-6.5 font-semibold underline underline-offset-2 disabled:opacity-50"
        >
          {isResending && <Spinner />}
          {isResending ? 'Sending...' : 'Resend verification email'}
        </button>
      )}
    </div>
  );
};
