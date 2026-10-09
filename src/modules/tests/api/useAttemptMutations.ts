import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attemptService } from '../services/attemptService';
import { ATTEMPT_MUTATION_KEYS } from './attempt.keys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import { toast } from 'sonner';
import type {
  StartAttemptPayload,
  StartAttemptResponseData,
  SaveProgressPayload,
  SaveProgressResponse,
  SubmitAttemptPayload,
  SubmitAttemptResponse,
  DisconnectAttemptPayload,
  DisconnectAttemptResponse,
  RecordViolationPayload,
  RecordViolationResponse,
} from '@/types/attempt.types';
import type { ApiResponse } from '@/types/api.types';

export function useAttemptMutations() {
  const queryClient = useQueryClient();
  const { orgId } = useActiveOrgId();

  // Helper to extract clean server error messages
  const showError = (error: any, fallback: string) => {
    const msg = error?.response?.data?.message || error?.message || fallback;
    toast.error(Array.isArray(msg) ? msg[0] : msg);
  };

  // 1. Initialize and start a test attempt session
  const startAttempt = useMutation<
    ApiResponse<StartAttemptResponseData>,
    Error,
    Omit<StartAttemptPayload, 'orgId'> & { orgId?: string }
  >({
    mutationKey: ATTEMPT_MUTATION_KEYS.start(),
    mutationFn: (payload) => {
      if (!activeOrgId) {
        throw new Error('Organization context is missing for this attempt.');
      }
      if (!payload.test_id || !payload.testset_id) {
        throw new Error('Valid test_id and testset_id are required to start an attempt.');
      }

      return attemptService.startAttempt({
        test_id: payload.test_id,
        testset_id: payload.testset_id,
        orgId: activeOrgId,
      });
    },
    onError: (error) => {
      showError(error, 'Failed to start test attempt');
    },
  });

  // 2. Background save / sync progress to Redis
  const saveProgress = useMutation<
    ApiResponse<SaveProgressResponse>,
    Error,
    SaveProgressPayload
  >({
    mutationKey: ATTEMPT_MUTATION_KEYS.saveProgress(),
    mutationFn: (data: SaveProgressPayload) =>
      attemptService.saveProgress(data),
    onError: (error) => {
      console.warn('Auto-save progress failed in background:', error);
    },
  });

  // 3. Final exam submission (Manual by student)
  const submitAttempt = useMutation<
    ApiResponse<SubmitAttemptResponse>,
    Error,
    SubmitAttemptPayload
  >({
    mutationKey: ATTEMPT_MUTATION_KEYS.submit(),
    mutationFn: (data: SubmitAttemptPayload) =>
      attemptService.submitAttempt(data),
    onSuccess: () => {
      toast.success('Exam submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ATTEMPT_MUTATION_KEYS.all });
    },
    onError: (error) => {
      showError(error, 'Failed to submit exam');
    },
  });

  // 4. Emergency disconnect submit (Tab close / lost connection)
  const disconnectAttempt = useMutation<
    ApiResponse<DisconnectAttemptResponse>,
    Error,
    DisconnectAttemptPayload
  >({
    mutationKey: ATTEMPT_MUTATION_KEYS.disconnect(),
    mutationFn: (data: DisconnectAttemptPayload) =>
      attemptService.disconnectAttempt(data),
    onError: (error) => {
      console.warn('Disconnect attempt flush failed:', error);
    },
  });

  // 5. Report proctoring violation
  const recordViolation = useMutation<
    ApiResponse<RecordViolationResponse>,
    Error,
    {
      attemptId: string;
      payload: Omit<RecordViolationPayload['payload'], 'orgId'> & { orgId?: string };
    }
  >({
    mutationKey: ATTEMPT_MUTATION_KEYS.violation(),
    mutationFn: (data) => {
      const activeOrgId = data.payload.orgId || orgId;
      if (!activeOrgId) {
        throw new Error('Organization context is missing for recording violation.');
      }
      return attemptService.recordViolation({
        attemptId: data.attemptId,
        payload: {
          ...data.payload,
          orgId: activeOrgId,
        },
      });
    },
    onError: (error) => {
      console.error('Violation record failed:', error);
    },
  });

  return {
    startAttempt,
    saveProgress,
    submitAttempt,
    disconnectAttempt,
    recordViolation,
  };
}