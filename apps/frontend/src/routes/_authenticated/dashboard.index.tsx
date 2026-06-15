import { createFileRoute } from '@tanstack/react-router';

import { BookmarksList } from '../../features/bookmarks/components/BookmarksList';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: BookmarksList,
});
