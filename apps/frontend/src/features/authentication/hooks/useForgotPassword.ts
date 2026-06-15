import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { forgotPasswordApi } from '../api/auth.api';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
    onError: () => toast.error('Failed to send reset link'),
  });
};
