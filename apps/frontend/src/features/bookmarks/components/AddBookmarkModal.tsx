import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from '@aureo/ui';

type AddBookmarkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddBookmarkModal = ({ open, onOpenChange }: AddBookmarkModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bm-url">URL *</FieldLabel>
              <Input id="bm-url" type="url" placeholder="https://example.com" autoFocus />
            </Field>
            <Field>
              <FieldLabel htmlFor="bm-title">Title *</FieldLabel>
              <Input id="bm-title" placeholder="My awesome resource" />
            </Field>
            <Field>
              <FieldLabel htmlFor="bm-description">Description</FieldLabel>
              <Input id="bm-description" placeholder="Short description..." />
            </Field>
            <Field>
              <FieldLabel htmlFor="bm-tags">Tags</FieldLabel>
              <Input id="bm-tags" placeholder="AI, Design, React" />
              <p className="mt-1 text-xs text-custom-neutral-400">Separate tags with commas.</p>
            </Field>
          </FieldGroup>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
