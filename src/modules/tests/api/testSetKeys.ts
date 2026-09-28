import type {
    GetTestSetListQueryParams,
    GetTestSetCountQueryParams,
  } from '../types/testset.types';
  
  export const testSetKeys = {
    // 1. Global root: all test set queries across the entire app
    all: ['testSets'] as const,
  
    // 2. Organization boundary: all queries scoped to an organization
    org: (orgId: string | undefined) =>
      [...testSetKeys.all, 'org', orgId] as const,
  
    // 3. Test boundary: all queries scoped to a parent test within an org
    test: (orgId: string | undefined, testId: string | undefined) =>
      [...testSetKeys.org(orgId), 'test', testId] as const,
  
    // 4. Lists: all paginated sets for a test (plural for group invalidation)
    lists: (orgId: string | undefined, testId: string | undefined) =>
      [...testSetKeys.test(orgId, testId), 'list'] as const,
  
    // Specific paginated page/filter query (singular for useQuery)
    list: (
      orgId: string | undefined,
      testId: string | undefined,
      params: Omit<GetTestSetListQueryParams, 'testId' | 'org_Id'>,
    ) => [...testSetKeys.lists(orgId, testId), params] as const,
  
    // 5. Counts: all count queries for a test (plural for group invalidation)
    counts: (orgId: string | undefined, testId: string | undefined) =>
      [...testSetKeys.test(orgId, testId), 'count'] as const,
  
    // Specific count query with filter (singular for useQuery)
    count: (
      orgId: string | undefined,
      testId: string | undefined,
      params?: Omit<GetTestSetCountQueryParams, 'testId' | 'org_Id'>,
    ) => [...testSetKeys.counts(orgId, testId), params] as const,
  
    // 6. Details: all test set detail views for a test (plural for group invalidation)
    details: (orgId: string | undefined, testId: string | undefined) =>
      [...testSetKeys.test(orgId, testId), 'detail'] as const,
  
    // Specific test set detail/questions view (singular for useQuery)
    detail: (
      orgId: string | undefined,
      testId: string | undefined,
      testSetId: string | undefined,
    ) => [...testSetKeys.details(orgId, testId), testSetId] as const,
  
    // 7. Aggregations: test sets count mapped per test (dashboard/reporting)
    perTest: (orgId: string | undefined) =>
      [...testSetKeys.org(orgId), 'per-test'] as const,
  };