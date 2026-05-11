import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, FieldError, FieldGroup, FieldLabel, Input, Spinner } from '@aureo/ui';
import { AlertCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { useRegister } from '../hooks/useRegister';
import { RegisterFormValues, RegisterSchema } from '../schemas/register-schema';

type RegisterFormProps = {
  onSuccess: (email: string) => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { mutateAsync: register } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data);
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
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Full name *</FieldLabel>
              <Input {...field} id="name" aria-invalid={fieldState.invalid} autoComplete="name" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email *</FieldLabel>
              <Input {...field} id="email" aria-invalid={fieldState.invalid} autoComplete="email" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password *</FieldLabel>
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
      </FieldGroup>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};
