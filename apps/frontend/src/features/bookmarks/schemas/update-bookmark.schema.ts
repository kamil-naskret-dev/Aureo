import { z } from 'zod';

export const UpdateBookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().max(300, 'Description must be at most 300 characters').optional(),
  tags: z
    .array(z.string().min(1).max(50, 'Each tag must be at most 50 characters'))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
});

export type UpdateBookmarkFormValues = z.infer<typeof UpdateBookmarkSchema>;
