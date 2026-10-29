import type { GetAttemptHistoryQueryParams } from '../types/history.types';

export const historyKeys = {
  all: ['attempt-history'] as const,
  org: (orgId: string | undefined) => [...historyKeys.all, 'org', orgId] as const,

  lists: (orgId: string | undefined) => [...historyKeys.org(orgId), 'list'] as const,
  list: (
    orgId: string | undefined,
    params?: Omit<GetAttemptHistoryQueryParams, 'orgId'>,
  ) => [...historyKeys.lists(orgId), params] as const,

  details: (orgId: string | undefined) => [...historyKeys.org(orgId), 'detail'] as const,
  detail: (orgId: string | undefined, attemptId: string) =>
    [...historyKeys.details(orgId), attemptId] as const,
};