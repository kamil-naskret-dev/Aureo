import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/archived')({
  component: ArchivedPage,
});

function ArchivedPage() {
  return null;
}
