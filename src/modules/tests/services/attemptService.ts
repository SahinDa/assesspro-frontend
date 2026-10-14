import { apiClient } from '@/lib/apiClient';
import { TEST_ENDPOINTS } from '../constants/endpoints';
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
      disconnectAttempt: async ({
        attemptId,
        payload,
      }: DisconnectAttemptPayload): Promise<ApiResponse<DisconnectAttemptResponse>> => {
        const endpoint = TEST_ENDPOINTS.DISCONNECT_ATTEMPT(attemptId)
      
        const baseUrl = ENV.API_BASE_URL.replace(/\/+$/, '')
        const cleanEndpoint = endpoint.replace(/^\/+/, '')
        const fullUrl = `${baseUrl}/${cleanEndpoint}`
      
        try {
          const res = await fetch(fullUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: 'include',
            keepalive: true,
          })
      
          const data = await res.json()
      
          if (!res.ok) {
            console.error('[DISCONNECT FETCH ERROR RESPONSE]:', data)
            throw new Error(data?.message || `Disconnect failed with status ${res.status}`)
          }
      
          return data
        } catch (err) {
          console.warn('[DISCONNECT FETCH FAILED - FALLBACK TO AXIOS]:', err)
          const res = await apiClient.post<ApiResponse<DisconnectAttemptResponse>>(
            endpoint,
            payload
          )
          return res.data
        }
      },
    recordViolation : async ({attemptId,payload}: RecordViolationPayload): Promise<ApiResponse<RecordViolationResponse>> => {
        const res = await apiClient.post<ApiResponse<RecordViolationResponse>>(
          TEST_ENDPOINTS.RECORD_VIOLATION(attemptId),
          payload
        );
        return res.data;
      },
    
}