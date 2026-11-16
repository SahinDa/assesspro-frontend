import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { studentService } from '../services/studentService';
import { STUDENT_QUERY_KEYS } from '../constants/studentQueryKeys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import type {
  StudentListQueryParams,
  SearchStudentsQueryParams,
} from '../types/student.types';

export function useActiveStudents(
  params: Omit<StudentListQueryParams, 'orgId'> = { offset: 0, limit: 10 },
  adminOrgId?: string,
  enabled = true,
) {
  const { orgId } = useActiveOrgId(adminOrgId);
  const queryParams: StudentListQueryParams = { ...params, orgId };

  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.activeList(queryParams),
    queryFn: () => studentService.getActiveStudents(queryParams),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function usePendingStudents(
  params: Omit<StudentListQueryParams, 'orgId'> = { offset: 0, limit: 10 },
  adminOrgId?: string,
  enabled = true,
) {
  const { orgId } = useActiveOrgId(adminOrgId);
  const queryParams: StudentListQueryParams = { ...params, orgId };

  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.pendingList(queryParams),
    queryFn: () => studentService.getPendingStudents(queryParams),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useRejectedStudents(
  params: Omit<StudentListQueryParams, 'orgId'> = { offset: 0, limit: 10 },
  adminOrgId?: string,
  enabled = true,
) {
  const { orgId } = useActiveOrgId(adminOrgId);
  const queryParams: StudentListQueryParams = { ...params, orgId };

  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.rejectedList(queryParams),
    queryFn: () => studentService.getRejectedStudents(queryParams),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useStudentsCount(adminOrgId?: string, enabled = true) {
  const { orgId } = useActiveOrgId(adminOrgId);
  const queryParams = { orgId };

  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.count(queryParams),
    queryFn: () => studentService.getStudentsCount(queryParams),
    enabled,
  });
}

export function useSearchStudents(
  params: Omit<SearchStudentsQueryParams, 'orgId'>,
  adminOrgId?: string,
  enabled = true,
) {
  const { orgId } = useActiveOrgId(adminOrgId);
  const queryParams: SearchStudentsQueryParams = { ...params, orgId };

  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.search(queryParams),
    queryFn: () => studentService.searchStudents(queryParams),
    enabled: enabled && params.query.trim().length > 0,
    placeholderData: keepPreviousData,
  });
}