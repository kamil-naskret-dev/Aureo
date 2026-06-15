import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { resetPasswordApi } from '../api/auth.api';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
    onError: () => toast.error('Failed to reset password'),
  });
};
