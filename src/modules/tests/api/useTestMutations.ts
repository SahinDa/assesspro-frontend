import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '../services/testService';
import { testKeys } from './testKeys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
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

  // Create Test
  const createTest = useMutation({
    mutationFn: (payload: CreateTestPayload) => {
      assertOrgAccess();
      return testService.createTest(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testKeys.lists(orgId) });
      queryClient.invalidateQueries({ queryKey: testKeys.counts(orgId) });
    },
  });

  // Update Test Details
  const updateTest = useMutation({
    mutationFn: (params: UpdateTestParams) => {
      assertOrgAccess();
      return testService.updateTest(params);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.detail(orgId, variables.testId) });
      queryClient.invalidateQueries({ queryKey: testKeys.lists(orgId) });
    },
  });

  // Toggle Test Active/Inactive Status
  const toggleStatus = useMutation({
    mutationFn: (params: ToggleTestStatusParams) => {
      assertOrgAccess();
      return testService.toggleTestStatus(params);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.detail(orgId, variables.testId) });
      queryClient.invalidateQueries({ queryKey: testKeys.lists(orgId) });
    },
  });

  // Delete Test
  const deleteTest = useMutation({
    mutationFn: (params: DeleteTestParams) => {
      assertOrgAccess();
      return testService.deleteTest(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testKeys.lists(orgId) });
      queryClient.invalidateQueries({ queryKey: testKeys.counts(orgId) });
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