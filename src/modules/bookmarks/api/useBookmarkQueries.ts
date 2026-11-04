import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { bookmarksService } from '../services/bookmarksService';
import { bookmarkKeys } from './bookmark.keys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';

export function useBookmarkQueries(
    params: Omit<GetBookmarksQueryParams, 'orgId'> = {
      offset: 0,
      limit: 10,
      isOrgBookmark: false,
    },
    adminOrgId?: string,
  ) {
    const { orgId } = useActiveOrgId(adminOrgId);
  
    return useQuery({
      queryKey: bookmarkKeys.list({...params,orgId}),
      queryFn: () => bookmarksService.getAllBookmarks({ ...params, orgId }),
      select: (res): GetBookmarksResponse => res.data,
      enabled: Boolean(orgId),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 2, // 2 minutes
    });
  }

  export function useBookmarkCountQueries(
    adminOrgId?: string,
  ) {
    const { orgId } = useActiveOrgId(adminOrgId);
  
    return useQuery({
      queryKey: bookmarkKeys.count({orgId}),
      queryFn: () => bookmarksService.bookmarkCount({ orgId }),
      select: (res): BookmarkCountResponse=> res.data,
      enabled: Boolean(orgId),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 2, // 2 minutes
    });
  }