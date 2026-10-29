import type { GetAttemptHistoryQueryParams } from '../types/history.types';

export const historyKeys = {
  all: ['attempt-history'] as const,
  org: (orgId: string | undefined) => [...attemptHistoryKeys.all, 'org', orgId] as const,

  lists: (orgId: string | undefined) => [...attemptHistoryKeys.org(orgId), 'list'] as const,
  list: (
    orgId: string | undefined,
    params?: Omit<GetAttemptHistoryQueryParams, 'orgId'>,
  ) => [...attemptHistoryKeys.lists(orgId), params] as const,

  details: (orgId: string | undefined) => [...attemptHistoryKeys.org(orgId), 'detail'] as const,
  detail: (orgId: string | undefined, attemptId: string) =>
    [...attemptHistoryKeys.details(orgId), attemptId] as const,
};