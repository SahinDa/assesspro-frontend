import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { testSetService } from '../services/testsetService';
import { testSetKeys } from './testSetKeys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import type {
  GetTestSetListQueryParams,
  GetTestSetCountQueryParams,
  TestSetListItem,
  TestSetDetailData,
} from '../types/testset.types';

/**
 * Fetch paginated list of test sets scoped to an organization and a parent test.
 */
export function useTestSetList(
  testId: string | undefined,
  params: Omit<GetTestSetListQueryParams, 'orgId' | 'testId'> = { offset: 0, limit: 12 },
  adminOrgId?: string,
) {
  const { orgId } = useActiveOrgId(adminOrgId);

  return useQuery({
    queryKey: testSetKeys.list(orgId, testId, params),
    queryFn: () =>
      testSetService.testSetList({
        testId: testId!,
        orgId:orgId!,
        ...params,
      }),
    select: (res): TestSetListItem[] => res.data,
    enabled: Boolean(orgId) && Boolean(testId),
    placeholderData: keepPreviousData, // Keeps previous page on screen while fetching the next
  });
}

/**
 * Fetch total test set count for a test scoped to the active organization.
 */
export function useTestSetCount(
  testId: string | undefined,
  params?: Omit<GetTestSetCountQueryParams, 'orgId' | 'testId'>,
  adminOrgId?: string,
) {
  const { orgId } = useActiveOrgId(adminOrgId);

  return useQuery({
    queryKey: testSetKeys.counts(orgId, testId),
    queryFn: () =>
      testSetService.testSetCount({
        testId: testId!,
        orgId:orgId!,
        ...params,
      }),
    select: (res): number => res.data.count,
    enabled: Boolean(orgId) && Boolean(testId),
  });
}

/**
 * Fetch full details of a single test set by its testSetId and parent testId.
 */
export function useTestSetDetail(
  testId: string | undefined,
  testSetId: string | undefined,
  adminOrgId?: string,
) {
  const { orgId } = useActiveOrgId(adminOrgId);
  return useQuery({
    queryKey: testSetKeys.detail(orgId, testId, testSetId),
    queryFn: () =>
      testSetService.getTestSet({
        testId: testId!,
        testSetId: testSetId!,
        orgId:orgId!
      }),
    select: (res): TestSetDetailData => res.data,
    enabled: Boolean(orgId) && Boolean(testId) && Boolean(testSetId),
  });
}