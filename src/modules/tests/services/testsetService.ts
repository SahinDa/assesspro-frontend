import { apiClient } from '@/lib/apiClient';
import { TEST_ENDPOINTS } from '../constants/endpoints';
import type{
    CreateTestSetParams,
    CreateTestSetResponse
 } from '../types/testset.types';
import type { ApiResponse } from '@/types/api.types';

export const testSetService = {
  createTestSet: async ({testId, payload}: CreateTestSetParams): Promise<ApiResponse<CreateTestSetResponse>> => {
      const res = await apiClient.post<ApiResponse<CreateTestSetResponse>>(
        TEST_ENDPOINTS.CREATE_SET(testId),
        payload
        );
      return res.data;
    },
}