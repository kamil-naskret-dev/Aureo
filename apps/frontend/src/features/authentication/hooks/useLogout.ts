import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { logoutApi } from '../api/auth.api';

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      clearAuth();
      navigate({ to: '/' });
    },
  });
};
