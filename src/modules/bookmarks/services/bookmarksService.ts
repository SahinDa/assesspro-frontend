import { apiClient } from '@/lib/apiClient';
import { BOOKMARK_ENDPOINTS } from '../constants/endpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  GetBookmarksQueryParams,
  ToggleBookmarkPayload,
  ToggleBookmarkQueryParams,
  GetBookmarksResponse,
  ToggleBookmarkResponse,
  GetBookmarkCountParams,
  BookmarkCountResponse,
} from '../types/bookmark.types';

export const bookmarksService = {
  getAllBookmarks: async (
    params?: GetBookmarksQueryParams,
  ): Promise<ApiResponse<GetBookmarksResponse>> => {
    const res = await apiClient.get<ApiResponse<GetBookmarksResponse>>(
      BOOKMARK_ENDPOINTS.GET_ALL,
      { params },
    );
    return res.data;
  },

  toggleBookmark: async (
    payload: ToggleBookmarkPayload,
    params?: ToggleBookmarkQueryParams,
  ): Promise<ApiResponse<ToggleBookmarkResponse>> => {
    const res = await apiClient.post<ApiResponse<ToggleBookmarkResponse>>(
      BOOKMARK_ENDPOINTS.TOGGLE,
      payload,
      { params },
    );
    return res.data;
  },
  bookmarkCount: async (
    params?: GetBookmarkCountParams,
  ): Promise<ApiResponse<BookmarkCountResponse>> => {
    const res = await apiClient.get<ApiResponse<BookmarkCountResponse>>(
      BOOKMARK_ENDPOINTS.COUNT,
      { params },
    );
    return res.data;
  },
};