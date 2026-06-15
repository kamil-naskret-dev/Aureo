import { createFileRoute } from '@tanstack/react-router';

import { BookmarksList } from '../../features/bookmarks/components/BookmarksList';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  beforeLoad: () => {
    document.title = 'All Bookmarks — Aureo';
  },
  component: BookmarksList,
});
