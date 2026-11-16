import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services/studentService';
import { STUDENT_QUERY_KEYS } from './studentQueryKeys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import { JoinRequestStatus } from '@/config/enums';
import { toast } from 'sonner';
import type {
  HandleJoinRequestParams,
  RemoveOrgUserParams,
} from '../types/student.types';

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { isOrganization, orgId } = useActiveOrgId();

  // Guard against non-organization accounts (e.g. ADMIN, STUDENT) triggering mutations
  const assertOrgAccess = () => {
    if (!isOrganization || !orgId) {
      throw new Error('Forbidden: Only organization accounts can perform this action.');
    }
  };

  // Helper to extract clean server error messages
  const showError = (error: any, fallback: string) => {
    const msg = error?.response?.data?.message || error?.message || fallback;
    toast.error(Array.isArray(msg) ? msg[0] : msg);
  };

  // Approve or Reject Join Request (Organization only)
  const handleStudentRequest = useMutation({
    mutationFn: (params: HandleJoinRequestParams) => {
      assertOrgAccess();
      return studentService.handleStudentRequest(params);
    },
    onSuccess: (res, variables) => {
      const defaultMsg =
        variables.payload.action === JoinRequestStatus.APPROVED
          ? 'Student join request approved'
          : 'Student join request rejected';

      toast.success(res?.message || defaultMsg);
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.all });
    },
    onError: (error) => {
      showError(error, 'Failed to process join request');
    },
  });

  // Remove Active Student from Organization (Organization only)
  const removeStudent = useMutation({
    mutationFn: (params: RemoveOrgUserParams) => {
      assertOrgAccess();
      return studentService.removeStudent(params);
    },
    onSuccess: (res) => {
      toast.success(res?.message || 'Student removed from organization');
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.all });
    },
    onError: (error) => {
      showError(error, 'Failed to remove student');
    },
  });

  return {
    handleStudentRequest,
    removeStudent,
  };
}