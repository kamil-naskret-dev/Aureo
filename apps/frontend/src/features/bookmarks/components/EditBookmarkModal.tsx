import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
} from '@aureo/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useBookmarkActions } from '../hooks/useBookmarkActions';
import { UpdateBookmarkSchema, UpdateBookmarkFormValues } from '../schemas/update-bookmark.schema';
import { BookmarkResponse } from '../types/bookmark.types';
import { TagInput } from './TagInput';

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 300;

type EditBookmarkModalProps = {
  bookmark: BookmarkResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditBookmarkModal = ({ bookmark, open, onOpenChange }: EditBookmarkModalProps) => {
  const { update } = useBookmarkActions();

  const form = useForm<UpdateBookmarkFormValues>({
    resolver: zodResolver(UpdateBookmarkSchema),
    defaultValues: {
      title: bookmark.title,
      description: bookmark.description ?? '',
      tags: bookmark.tags,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: bookmark.title,
        description: bookmark.description ?? '',
        tags: bookmark.tags,
      });
    }
  }, [open, bookmark]);

  const {
    formState: { isSubmitting },
    watch,
  } = form;
  const titleValue = watch('title') ?? '';
  const descriptionValue = watch('description') ?? '';
  const isPending = isSubmitting || update.isPending;

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset();
    onOpenChange(value);
  };

  const onSubmit = async (data: UpdateBookmarkFormValues) => {
    try {
      await update.mutateAsync({
        id: bookmark.id,
        data: {
          title: data.title,
          description: data.description || undefined,
          tags: data.tags && data.tags.length > 0 ? data.tags : [],
        },
      });
      handleOpenChange(false);
    } catch {
      // onError in useBookmarkActions handles the toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-baseline justify-between">
                    <FieldLabel htmlFor="edit-bm-title">Title *</FieldLabel>
                    <span
                      className={`text-xs tabular-nums ${titleValue.length >= TITLE_MAX ? 'text-destructive' : 'text-custom-neutral-400'}`}
                    >
                      {titleValue.length}/{TITLE_MAX}
                    </span>
                  </div>
                  <Input
                    {...field}
                    id="edit-bm-title"
                    placeholder="My awesome resource"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    maxLength={TITLE_MAX}
                    autoFocus
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-baseline justify-between">
                    <FieldLabel htmlFor="edit-bm-description">
                      Description{' '}
                      <span className="text-custom-neutral-400 font-normal text-xs">optional</span>
                    </FieldLabel>
                    <span
                      className={`text-xs tabular-nums ${descriptionValue.length >= DESCRIPTION_MAX ? 'text-destructive' : 'text-custom-neutral-400'}`}
                    >
                      {descriptionValue.length}/{DESCRIPTION_MAX}
                    </span>
                  </div>
                  <Input
                    {...field}
                    id="edit-bm-description"
                    placeholder="Short description..."
                    aria-invalid={fieldState.invalid}
                    maxLength={DESCRIPTION_MAX}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-bm-tags">
                    Tags{' '}
                    <span className="text-custom-neutral-400 font-normal text-xs">optional</span>
                  </FieldLabel>
                  <TagInput
                    id="edit-bm-tags"
                    value={field.value ?? []}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <p className="mt-1 text-xs text-custom-neutral-400">
                      Press Enter or comma to add a tag. Max 20.
                    </p>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="flex-1" disabled={isPending}>
              {isPending && <Spinner aria-hidden="true" />}
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
