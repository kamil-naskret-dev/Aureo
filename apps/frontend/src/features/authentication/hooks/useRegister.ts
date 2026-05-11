import { useMutation } from '@tanstack/react-query';

import { registerApi } from '../api/auth.api';
import { RegisterFormValues } from '../schemas/register-schema';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterFormValues) =>
      registerApi({ name: data.name, email: data.email, password: data.password }),
  });
};
