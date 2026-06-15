export type SortOption = 'recently-added' | 'recently-visited' | 'most-visited';

export type BookmarkState = {
  pinned: boolean;
  archived: boolean;
};

export type BookmarkResponse = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  domain: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  state: BookmarkState | null;
};

export type PaginatedBookmarks = {
  data: BookmarkResponse[];
  total: number;
  page: number;
  limit: number;
};

export type TagWithCount = {
  name: string;
  count: number;
};

export type BookmarksQuery = {
  search?: string;
  tags?: string[];
  sort?: SortOption;
  page?: number;
  limit?: number;
  archived?: boolean;
};
