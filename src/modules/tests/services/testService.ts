import { apiClient } from '@/lib/apiClient';
import { TEST_ENDPOINTS } from '../constants/endpoints';
import type{
  CreateTestPayload,
  CreateTestResponse,
 } from '../types/test.types';
 import type { ApiResponse } from '@/types/api.types';

export const testService = {
  createTest: async (payload: CreateTestPayload): Promise<ApiResponse<CreateTestResponse>> => {
      const res = await apiClient.post<ApiResponse<CreateTestResponse>>(TEST_ENDPOINTS.CREATETEST,payload);
      return res.data;
    },
}