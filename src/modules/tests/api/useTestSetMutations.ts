import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testSetService } from '../services/testsetService';
import { testSetKeys } from './testSetKeys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import { toast } from 'sonner';
import type {
    CreateTestSetParams,
    UpdateTestSetParams,
    DeleteTestSetParams,
    ToggleTestSetStatusParams,
} from '../types/testset.types'

export function useTestSetMutations() {
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

  // Create TestSet 
  const createTestSet = useMutation({
    mutationFn: (payload: CreateTestSetParams) => {
      assertOrgAccess();
      return testSetService.createTestSet(payload);
    },
    onSuccess: (_data,variables) => {
      toast.success('Testset created successfully');
      queryClient.invalidateQueries({ queryKey: testSetKeys.lists(orgId,variables.testId) });
      queryClient.invalidateQueries({ queryKey: testSetKeys.counts(orgId,variables.testId) });
    },
    onError: (error) => {
      showError(error, 'Failed to create testset');
    },
  });


  // Update TestSet
  const updateTestSet = useMutation({
    mutationFn: (params: UpdateTestSetParams) => {
      assertOrgAccess();
      return testSetService.updateTestSet(params);
    },
    onSuccess: (_, variables) => {
      toast.success('Testset updated successfully');
      queryClient.invalidateQueries({ queryKey: testSetKeys.detail(orgId, variables.testId,variables.testSetId) });
      queryClient.invalidateQueries({ queryKey: testSetKeys.lists(orgId,variables.testId) });
    },
    onError: (error) => {
      showError(error, 'Failed to update testset');
    },
  });


  //Delete TestSet 
  const deleteTestSet = useMutation({
    mutationFn: (params:  DeleteTestSetParams) => {
      assertOrgAccess();
      return testSetService.deleteTestSet(params);
    },
    onSuccess: (_data,variables) => {
      toast.success('Testset deleted successfully');
      queryClient.removeQueries({
        queryKey: testSetKeys.detail(orgId, variables.testId, variables.testSetId),
      });
      queryClient.invalidateQueries({ queryKey: testSetKeys.lists(orgId,variables.testId) });
      queryClient.invalidateQueries({ queryKey: testSetKeys.counts(orgId,variables.testId) });
    },
    onError: (error) => {
      showError(error, 'Failed to delete testset');
    },
  });

   // Toggle TestSet Active/Inactive Status
   const toggleTestSetStatus = useMutation({
    mutationFn: (params:ToggleTestSetStatusParams) => {
      assertOrgAccess();
      return testSetService.toggleTestSetStatus(params);
    },
    onSuccess: (_, variables) => {
      toast.success( 'Testset status updated successfully');
      queryClient.invalidateQueries({ queryKey: testSetKeys.detail(orgId, variables.testId,variables.testSetId) });
      queryClient.invalidateQueries({ queryKey: testSetKeys.lists(orgId, variables.testId) });
    },
    onError: (error) => {
      showError(error, 'Failed to update testset status');
    },
  });

  return {
    createTestSet,
    updateTestSet,
    deleteTestSet,
    toggleTestSetStatus,
  };

}
