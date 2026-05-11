import { AuthActions } from './AuthActions';

export const ForgotPasswordActions = () => {
  return (
    <AuthActions
      actions={[
        {
          label: 'Remember your password?',
          linkText: 'Log in',
          to: '/',
        },
      ]}
    />
  );
};
