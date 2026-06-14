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
import { Controller, useForm } from 'react-hook-form';

import { useBookmarkActions } from '../hooks/useBookmarkActions';
import { CreateBookmarkFormValues, CreateBookmarkSchema } from '../schemas/create-bookmark.schema';
import { TagInput } from './TagInput';

const URL_MAX = 1000;
const TITLE_MAX = 100;
const DESCRIPTION_MAX = 300;

type AddBookmarkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddBookmarkModal = ({ open, onOpenChange }: AddBookmarkModalProps) => {
  const { create } = useBookmarkActions();

  const form = useForm<CreateBookmarkFormValues>({
    resolver: zodResolver(CreateBookmarkSchema),
    defaultValues: { url: '', title: '', description: '', tags: [] },
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;

  const urlValue = watch('url') ?? '';
  const titleValue = watch('title') ?? '';
  const descriptionValue = watch('description') ?? '';
  const isPending = isSubmitting || create.isPending;

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset();
    onOpenChange(value);
  };

  const onSubmit = async (data: CreateBookmarkFormValues) => {
    try {
      await create.mutateAsync({
        url: data.url,
        title: data.title,
        description: data.description || undefined,
        tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
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
          <DialogTitle>Add Bookmark</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FieldGroup>
            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-baseline justify-between">
                    <FieldLabel htmlFor="bm-url">URL *</FieldLabel>
                    <span
                      className={`text-xs tabular-nums ${urlValue.length >= URL_MAX ? 'text-destructive' : 'text-custom-neutral-400'}`}
                    >
                      {urlValue.length}/{URL_MAX}
                    </span>
                  </div>
                  <Input
                    {...field}
                    id="bm-url"
                    type="url"
                    placeholder="https://example.com"
                    autoFocus
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    maxLength={1000}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-baseline justify-between">
                    <FieldLabel htmlFor="bm-title">Title *</FieldLabel>
                    <span
                      className={`text-xs tabular-nums ${titleValue.length >= TITLE_MAX ? 'text-destructive' : 'text-custom-neutral-400'}`}
                    >
                      {titleValue.length}/{TITLE_MAX}
                    </span>
                  </div>
                  <Input
                    {...field}
                    id="bm-title"
                    placeholder="My awesome resource"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    maxLength={100}
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
                    <FieldLabel htmlFor="bm-description">
                      Description{' '}
                      <span className="text-custom-neutral-400 font-normal text-xs">optional</span>
                    </FieldLabel>
                    <span
                      className={`text-xs tabular-nums ${
                        descriptionValue.length >= DESCRIPTION_MAX
                          ? 'text-destructive'
                          : 'text-custom-neutral-400'
                      }`}
                    >
                      {descriptionValue.length}/{DESCRIPTION_MAX}
                    </span>
                  </div>
                  <Input
                    {...field}
                    id="bm-description"
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
                  <FieldLabel htmlFor="bm-tags">
                    Tags{' '}
                    <span className="text-custom-neutral-400 font-normal text-xs">optional</span>
                  </FieldLabel>
                  <TagInput
                    id="bm-tags"
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
              {isPending && <Spinner />}
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
