import { useQuery } from '@tanstack/react-query';

import { verifyEmailApi } from '../api/auth.api';

export const useVerifyEmail = (token: string) => {
  return useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => verifyEmailApi(token),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });
};
