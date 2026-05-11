import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, FieldError, FieldGroup, FieldLabel, Input, Spinner } from '@aureo/ui';
import { AlertCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { useResetPassword } from '../hooks/useResetPassword';
import { ResetPasswordFormValues, ResetPasswordSchema } from '../schemas/reset-password-schema';

type ResetPasswordFormProps = {
  token: string;
  onSuccess: () => void;
};

export const ResetPasswordForm = ({ token, onSuccess }: ResetPasswordFormProps) => {
  const { mutateAsync: resetPassword } = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword({ token, password: data.password });
      onSuccess();
    } catch (err) {
      form.setError('root', { message: (err as Error).message });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {errors.root && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? 'Resetting...' : 'Reset password'}
      </Button>
    </form>
  );
};
