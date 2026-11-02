import type { GetBookmarksQueryParams } from '../types/bookmark.types';

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  lists: () => [...bookmarkKeys.all, 'list'] as const,
  list: (params?: GetBookmarksQueryParams) =>
    [...bookmarkKeys.lists(), params ?? {}] as const,
};