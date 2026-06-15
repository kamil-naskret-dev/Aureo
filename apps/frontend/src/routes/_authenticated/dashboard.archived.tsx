import { createFileRoute } from '@tanstack/react-router';

import { ArchivedList } from '../../features/bookmarks/components/ArchivedList';

export const Route = createFileRoute('/_authenticated/dashboard/archived')({
  beforeLoad: () => {
    document.title = 'Archived — Aureo';
  },
  component: ArchivedList,
});
