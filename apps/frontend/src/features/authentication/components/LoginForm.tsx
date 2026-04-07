import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@aureo/ui';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async () => {
    try {
      // TODO: call login API
      await new Promise((resolve) => setTimeout(resolve, 800));
      throw new Error('demo');
    } catch {
      setError('root', {
        message: 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {errors.root && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in…' : 'Log in'}
      </Button>
    </form>
  );
};
