import { AuthActions } from './AuthActions';

export const RegisterActions = () => {
  return (
    <AuthActions
      actions={[
        {
          label: 'Already have an account?',
          linkText: 'Log in',
          to: '/',
        },
      ]}
    />
  );
};
