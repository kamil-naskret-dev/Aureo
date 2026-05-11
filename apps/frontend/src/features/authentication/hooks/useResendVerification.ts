import { useMutation } from '@tanstack/react-query';

import { resendVerificationApi } from '../api/auth.api';

export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerificationApi,
  });
};
