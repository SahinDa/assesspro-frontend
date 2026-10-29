import { apiClient } from '@/lib/apiClient';
import { HISTORY_ENDPOINTS } from '../constants/endpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  GetAttemptHistoryQueryParams,
  GetAttemptHistoryResponse,
  GetAttemptDetailsQueryParams,
  GetAttemptDetailsResponse,
} from '../types/history.types';

export const historyService = {
  getHistory: async (
    params?: GetAttemptHistoryQueryParams,
  ): Promise<ApiResponse<GetAttemptHistoryResponse>> => {
    const res = await apiClient.get<ApiResponse<GetAttemptHistoryResponse>>(
      HISTORY_ENDPOINTS.HISTORY,
      { params },
    );
    return res.data;
  },

  getDetails: async (
    params: GetAttemptDetailsQueryParams,
  ): Promise<ApiResponse<GetAttemptDetailsResponse>> => {
    const res = await apiClient.get<ApiResponse<GetAttemptDetailsResponse>>(
      HISTORY_ENDPOINTS.DETAILS,
      { params },
    );
    return res.data;
  },
};