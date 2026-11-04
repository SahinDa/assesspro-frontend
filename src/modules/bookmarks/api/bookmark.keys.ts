import type { 
  GetBookmarksQueryParams,
  GetBookmarkCountParams,
 } from '../types/bookmark.types';

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  lists: () => [...bookmarkKeys.all, 'list'] as const,
  list: (params?: GetBookmarksQueryParams) =>
    [...bookmarkKeys.lists(), params ?? {}] as const,
  counts: () => [...bookmarkKeys.all,'count'] as const,
  count : (params?: GetBookmarkCountParams) =>
         [...bookmarkKeys.counts(), params ?? {}] as const,  
};