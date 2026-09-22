import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { testService } from '../services/testService';
import { testKeys } from './testKeys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import type {
  GetTestListQueryParams,
  GetTestCountQueryParams,
  TestListItem,
  TestDetailData,
} from '../types/test.types';

/**
 * Fetch paginated list of tests scoped to the active organization.
 */
export function useTestList(
  params: Omit<GetTestListQueryParams, 'id'> = { offset: 0, limit: 12 },
  adminOrgId?: string,
) {
  const { orgId } = useActiveOrgId(adminOrgId);

  return useQuery({
    queryKey: testKeys.list(orgId, params),
    queryFn: () => testService.testList({ ...params, id: orgId }),
    select: (res): TestListItem[] => res.data,
    enabled: Boolean(orgId),
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch total test count scoped to the active organization.
 */
export function useTestCount(
  params?: Omit<GetTestCountQueryParams, 'id'>,
  adminOrgId?: string,
) {
  const { orgId } = useActiveOrgId(adminOrgId);

  return useQuery({
    queryKey: testKeys.count(orgId, params),
    queryFn: () => testService.testCount({ ...params, id: orgId }),
    select: (res): number => res.data.count,
    enabled: Boolean(orgId),
  });
}

/**
 * Fetch full details of a single test by its testId.
 */
export function useTestDetail(testId: string, adminOrgId?: string) {
  const { orgId } = useActiveOrgId(adminOrgId);

  return useQuery({
    queryKey: testKeys.detail(orgId, testId),
    queryFn: () => testService.getTest({ testId, id: orgId }),
    select: (res): TestDetailData => res.data,
    enabled: Boolean(orgId) && Boolean(testId),
  });
}