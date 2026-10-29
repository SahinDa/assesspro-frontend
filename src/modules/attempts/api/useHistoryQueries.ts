import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { historyService } from '../services/historyService';
import { historyKeys } from './history.keys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import type {
  GetAttemptHistoryQueryParams,
  GetAttemptHistoryResponse,
  GetAttemptDetailsResponse,
} from '../types/history.types';

/**
 * Fetch paginated & sorted attempt history scoped to the active organization.
 */
export function useHistory(
  params: Omit<GetAttemptHistoryQueryParams, 'orgId'> = { offset: 0, limit: 10 },
  adminOrgId?: string,
) {
  const { orgId } = useActiveOrgId(adminOrgId);

  return useQuery({
    queryKey: historyKeys.list(orgId, params),
    queryFn: () => historyService.getHistory({ ...params, orgId }),
    select: (res): GetAttemptHistoryResponse => res.data,
    enabled: Boolean(orgId),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Fetch full question-by-question review & details for a single attempt.
 */
export function useAttemptDetails(attemptId: string, adminOrgId?: string) {
  const { orgId } = useActiveOrgId(adminOrgId);

  return useQuery({
    queryKey: historyKeys.detail(orgId, attemptId),
    queryFn: () => historyService.getDetails({ attemptId }),
    select: (res): GetAttemptDetailsResponse => res.data,
    enabled: Boolean(orgId) && Boolean(attemptId),
    staleTime: 1000 * 60 * 5, // 5 minutes (attempt results are immutable)
  });
}