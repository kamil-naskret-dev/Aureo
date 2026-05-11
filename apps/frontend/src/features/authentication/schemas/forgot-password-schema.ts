import z from 'zod';

const ForgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export { ForgotPasswordSchema };
