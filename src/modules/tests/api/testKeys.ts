import type { GetTestListQueryParams, GetTestCountQueryParams } from '../types/test.types';

export const testKeys = {
  // Base namespace for all test-related queries
  all: ['tests'] as const,

  // Namespace scoped per organization
  org: (orgId: string | undefined) => [...testKeys.all, 'org', orgId] as const,

  // Lists scoped to an organization
  lists: (orgId: string | undefined) => [...testKeys.org(orgId), 'list'] as const,
  list: (orgId: string | undefined, params: Omit<GetTestListQueryParams, 'id'>) =>
    [...testKeys.lists(orgId), params] as const,

  // Counts scoped to an organization
  counts: (orgId: string | undefined) => [...testKeys.org(orgId), 'count'] as const,
  count: (orgId: string | undefined, params?: Omit<GetTestCountQueryParams, 'id'>) =>
    [...testKeys.counts(orgId), params] as const,

  // Details scoped to an organization and testId
  details: (orgId: string | undefined) => [...testKeys.org(orgId), 'detail'] as const,
  detail: (orgId: string | undefined, testId: string) =>
    [...testKeys.details(orgId), testId] as const,
};