import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { loginApi } from '../api/auth.api';

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
};
