import { ApiEnvelope } from '../../../lib/http/api-types';
import { http } from '../../../lib/http/http';
import { BookmarkResponse, BookmarksQuery, PaginatedBookmarks } from '../types/bookmark.types';

export const fetchBookmarks = async (query: BookmarksQuery): Promise<PaginatedBookmarks> => {
  const params = new URLSearchParams();

  if (query.search) params.set('search', query.search);
  if (query.sort) params.set('sort', query.sort);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  query.tags?.forEach((tag) => params.append('tags', tag));

  const response = await http.get<ApiEnvelope<PaginatedBookmarks>>('/api/bookmarks', { params });
  return response.data.data;
};

export const togglePinApi = async (id: string): Promise<BookmarkResponse> => {
  const response = await http.patch<ApiEnvelope<BookmarkResponse>>(`/api/bookmarks/${id}/pin`);
  return response.data.data;
};

export const toggleArchiveApi = async (id: string): Promise<BookmarkResponse> => {
  const response = await http.patch<ApiEnvelope<BookmarkResponse>>(`/api/bookmarks/${id}/archive`);
  return response.data.data;
};

export const deleteBookmarkApi = async (id: string): Promise<void> => {
  await http.delete(`/api/bookmarks/${id}`);
};
