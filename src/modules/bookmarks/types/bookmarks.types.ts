import { BookmarkType } from '@/config/enums';

// ==========================================
// 1. Bookmark Query & Payload Interfaces
// ==========================================

export interface GetBookmarksQueryParams {
  limit?: number;
  offset?: number;
  isOrgBookmark?: boolean;
  orgId?: string; // Target organization ID
}

export interface ToggleBookmarkPayload {
  item_id: string;
  item_type: BookmarkType | number;
}

export interface ToggleBookmarkQueryParams {
  id?: string; // Optional target organization ID (used by students)
}

// ==========================================
// 2. Bookmark Entity & Response Interfaces
// ==========================================

export interface BookmarkItem {
  bookmark_id: string;
  user_id: string | null;
  org_id: string;
  item_id: string;
  item_type: BookmarkType | number;
  created_at: string;
}

export interface GetBookmarksResponse {
  data: BookmarkItem[];
  total: number;
}

export interface ToggleBookmarkRemovedResponse {
  message: string;
  bookmarked: false;
}

export interface ToggleBookmarkAddedResponse {
  message: string;
  bookmarked: true;
  data: BookmarkItem;
}

export type ToggleBookmarkResponse =
  | ToggleBookmarkRemovedResponse
  | ToggleBookmarkAddedResponse;