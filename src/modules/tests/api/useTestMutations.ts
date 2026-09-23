import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '../services/testService';
import { testKeys } from './testKeys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import { toast } from 'sonner';
import type {
  CreateTestPayload,
  UpdateTestParams,
  ToggleTestStatusParams,
  DeleteTestParams,
} from '../types/test.types';

export function useTestMutations() {
  const queryClient = useQueryClient();
  const { orgId, canManageTests } = useActiveOrgId();

  // Guard against non-organization accounts triggering mutations
  const assertOrgAccess = () => {
    if (!canManageTests || !orgId) {
      throw new Error('Forbidden: Only organization accounts can perform this action.');
    }
  };

  // Helper to extract clean server error messages
  const showError = (error: any, fallback: string) => {
    const msg = error?.response?.data?.message || error?.message || fallback;
    toast.error(Array.isArray(msg) ? msg[0] : msg);
  };

  // Create Test
  const createTest = useMutation({
    mutationFn: (payload: CreateTestPayload) => {
      assertOrgAccess();
      return testService.createTest(payload);
    },
    onSuccess: () => {
      toast.success('Test created successfully');
      queryClient.invalidateQueries({ queryKey: testKeys.lists(orgId) });
      queryClient.invalidateQueries({ queryKey: testKeys.counts(orgId) });
    },
    onError: (error) => {
      showError(error, 'Failed to create test');
    },
  });

  // Update Test Details
  const updateTest = useMutation({
    mutationFn: (params: UpdateTestParams) => {
      assertOrgAccess();
      return testService.updateTest(params);
    },
    onSuccess: (_, variables) => {
      toast.success('Test updated successfully');
      queryClient.invalidateQueries({ queryKey: testKeys.detail(orgId, variables.testId) });
      queryClient.invalidateQueries({ queryKey: testKeys.lists(orgId) });
    },
    onError: (error) => {
      showError(error, 'Failed to update test');
    },
  });

  // Toggle Test Active/Inactive Status
  const toggleStatus = useMutation({
    mutationFn: (params: ToggleTestStatusParams) => {
      assertOrgAccess();
      return testService.toggleTestStatus(params);
    },
    onSuccess: (_, variables) => {
      toast.success( 'Test status updated successfully');
      queryClient.invalidateQueries({ queryKey: testKeys.detail(orgId, variables.testId) });
      queryClient.invalidateQueries({ queryKey: testKeys.lists(orgId) });
    },
    onError: (error) => {
      showError(error, 'Failed to update test status');
    },
  });

  // Delete Test
  const deleteTest = useMutation({
    mutationFn: (params: DeleteTestParams) => {
      assertOrgAccess();
      return testService.deleteTest(params);
    },
    onSuccess: () => {
      toast.success('Test deleted successfully');
      queryClient.invalidateQueries({ queryKey: testKeys.lists(orgId) });
      queryClient.invalidateQueries({ queryKey: testKeys.counts(orgId) });
    },
    onError: (error) => {
      showError(error, 'Failed to delete test');
    },
  });

  return {
    canManageTests,
    createTest,
    updateTest,
    toggleStatus,
    deleteTest,
  };
}