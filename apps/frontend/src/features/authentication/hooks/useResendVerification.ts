import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { resendVerificationApi } from '../api/auth.api';

export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerificationApi,
    onError: () => toast.error('Failed to resend verification email'),
  });
};
