import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, FieldError, FieldGroup, FieldLabel, Input, Spinner } from '@aureo/ui';
import { AlertCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { useForgotPassword } from '../hooks/useForgotPassword';
import { ForgotPasswordFormValues, ForgotPasswordSchema } from '../schemas/forgot-password-schema';

type ForgotPasswordFormProps = {
  onSuccess: (email: string) => void;
};

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const { mutateAsync: forgotPassword } = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(data);
      onSuccess(data.email);
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
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input {...field} id="email" aria-invalid={fieldState.invalid} autoComplete="email" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </Button>
    </form>
  );
};
