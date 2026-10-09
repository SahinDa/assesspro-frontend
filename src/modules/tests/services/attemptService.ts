import { apiClient } from '@/lib/apiClient';
import { TEST_ENDPOINTS } from '../constants/endpoints';
import {
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
} from '../types/attempt.types';
import type { ApiResponse } from '@/types/api.types';

export const attemptService  = {
    startAttempt : async (payload : StartAttemptPayload): Promise<ApiResponse<StartAttemptResponseData>> => {
        const res = await apiClient.post<ApiResponse<StartAttemptResponseData>>(
          TEST_ENDPOINTS.START_ATTEMPT,
          payload
        );
        return res.data;
      },
    saveProgress : async ({ attemptId, payload }: SaveProgressPayload): Promise<ApiResponse<SaveProgressResponse>> => {
        const res = await apiClient.post<ApiResponse<SaveProgressResponse>>(
          TEST_ENDPOINTS.SAVE_PROGRESS(attemptId),
          payload
        );
        return res.data;
      },
    submitAttempt :  async ({attemptId, payload} : SubmitAttemptPayload): Promise<ApiResponse<SubmitAttemptResponse>> => {
        const res = await apiClient.post<ApiResponse<SubmitAttemptResponse>>(
          TEST_ENDPOINTS.SUBMIT_ATTEMPT(attemptId),
          payload
        );
        return res.data;
      },
    disconnectAttempt : async ({attemptId,payload }:DisconnectAttemptPayload): Promise<ApiResponse<DisconnectAttemptResponse>> => {
        const res = await apiClient.post<ApiResponse<DisconnectAttemptResponse>>(
          TEST_ENDPOINTS.DISCONNECT_ATTEMPT(attemptId),
          payload
        );
        return res.data;
      },
    recordViolation : async ({attemptId,payload}: RecordViolationPayload): Promise<ApiResponse<RecordViolationResponse>> => {
        const res = await apiClient.post<ApiResponse<RecordViolationResponse>>(
          TEST_ENDPOINTS.RECORD_VIOLATION(attemptId),
          payload
        );
        return res.data;
      },
    
}