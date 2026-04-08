import { AuthActions } from './AuthActions';

export const LoginActions = () => {
  return (
    <AuthActions
      actions={[
        {
          label: 'Forgot password?',
          linkText: 'Reset it',
          to: '/reset-password',
        },
        {
          label: "Don't have an account?",
          linkText: 'Sign up',
          to: '/sign-up',
        },
      ]}
    />
  );
};
