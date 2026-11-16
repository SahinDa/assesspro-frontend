import type {
    StudentListQueryParams,
    StudentCountQueryParams,
    SearchStudentsQueryParams,
  } from '../types/student.types';
  
  export const STUDENT_QUERY_KEYS = {
    all: ['students'] as const,
    lists: () => [...STUDENT_QUERY_KEYS.all, 'list'] as const,
    activeList: (params?: StudentListQueryParams) =>
      [...STUDENT_QUERY_KEYS.lists(), 'active', params] as const,
    pendingList: (params?: StudentListQueryParams) =>
      [...STUDENT_QUERY_KEYS.lists(), 'pending', params] as const,
    rejectedList: (params?: StudentListQueryParams) =>
      [...STUDENT_QUERY_KEYS.lists(), 'rejected', params] as const,
    search: (params: SearchStudentsQueryParams) =>
      [...STUDENT_QUERY_KEYS.all, 'search', params] as const,
    count: (params?: StudentCountQueryParams) =>
      [...STUDENT_QUERY_KEYS.all, 'count', params] as const,
  } as const;