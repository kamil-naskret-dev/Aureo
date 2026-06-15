import { ApiEnvelope } from '../../../lib/http/api-types';
import { http } from '../../../lib/http/http';
import {
  BookmarkResponse,
  BookmarksQuery,
  PaginatedBookmarks,
  TagWithCount,
} from '../types/bookmark.types';

export const fetchBookmarks = async (query: BookmarksQuery): Promise<PaginatedBookmarks> => {
  const params = new URLSearchParams();

  if (query.search) params.set('search', query.search);
  if (query.sort) params.set('sort', query.sort);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.archived !== undefined) params.set('archived', String(query.archived));
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

export const fetchTagsApi = async (archived: boolean): Promise<TagWithCount[]> => {
  const params = new URLSearchParams({ archived: String(archived) });
  const response = await http.get<ApiEnvelope<TagWithCount[]>>('/api/bookmarks/tags', { params });
  return response.data.data;
};

export const createBookmarkApi = async (data: {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
}): Promise<BookmarkResponse> => {
  const response = await http.post<ApiEnvelope<BookmarkResponse>>('/api/bookmarks', data);
  return response.data.data;
};
