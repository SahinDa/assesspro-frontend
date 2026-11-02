import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarksService } from '../services/bookmarksService';
import { bookmarkKeys } from './bookmark.keys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import type {
  ToggleBookmarkPayload,
  ToggleBookmarkResponse,
} from '../types/bookmark.types';
import type { ApiResponse } from '@/types/api.types';

/**
 * Mutation hook to toggle (add / remove) a bookmark.
 */
export function useToggleBookmarkMutation(adminOrgId?: string) {
  const queryClient = useQueryClient();
  const { orgId } = useActiveOrgId(adminOrgId);

  return useMutation<ApiResponse<ToggleBookmarkResponse>, Error, ToggleBookmarkPayload>({
    mutationFn: (payload: ToggleBookmarkPayload) =>
      bookmarksService.toggleBookmark(
        payload,
        orgId ? { id: orgId } : undefined,
      ),
    onSuccess: () => {
      // Invalidate bookmark query lists so active lists update immediately
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.lists(),
      });
    },
  });
}