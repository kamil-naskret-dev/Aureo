import { CardDescription, CardTitle } from '@aureo/ui';
import { Loader2 } from 'lucide-react';

export const VerifyEmailLoading = () => {
  return (
    <>
      <Loader2 className="size-10 animate-spin text-custom-primary-700" />
      <div className="flex flex-col gap-1.5">
        <CardTitle>Verifying your email...</CardTitle>
        <CardDescription>This will only take a moment.</CardDescription>
      </div>
    </>
  );
};
