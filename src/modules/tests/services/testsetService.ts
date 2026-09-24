import { apiClient } from '@/lib/apiClient';
import { TEST_ENDPOINTS } from '../constants/endpoints';
import type {
  CreateTestSetParams,
  CreateTestSetResponse,
  UpdateTestSetParams,
  UpdateTestSetResponse,
  DeleteTestSetParams,
  DeleteTestSetResponse,
  GetTestSetListQueryParams,
  TestSetListItem,
  GetTestSetQueryParams,
  GetTestSetCountQueryParams,
  TestSetCountData,
  ToggleTestSetStatusParams,
  ToggleTestSetStatusResponse,

} from '../types/testset.types';
import type { ApiResponse } from '@/types/api.types';

export const testSetService = {
  createTestSet: async ({ testId,payload }: CreateTestSetParams): Promise<ApiResponse<CreateTestSetResponse>> => {
    const res = await apiClient.post<ApiResponse<CreateTestSetResponse>>(
      TEST_ENDPOINTS.CREATE_TESTSET(testId),
      payload
    );
    return res.data;
  },
  updateTestSet: async ({ testId, testSetId, payload }: UpdateTestSetParams): Promise<ApiResponse<UpdateTestSetResponse>> => {
    const res = await apiClient.patch<ApiResponse<UpdateTestSetResponse>>(
      TEST_ENDPOINTS.UPDATE_TESTSET(testId, testSetId),
      payload
    );
    return res.data;
  },
  deleteTestSet: async ({ testId, testSetId}: DeleteTestSetParams): Promise<ApiResponse<DeleteTestSetResponse>> => {
    const res = await apiClient.delete<ApiResponse<DeleteTestSetResponse>>(
      TEST_ENDPOINTS.DELETE_TESTSET(testId, testSetId),
    );
    return res.data;
  },
  testSetList: async ({ testId,...payload}: GetTestSetListQueryParams): Promise<ApiResponse<TestSetListItem[]>> => {
    const res = await apiClient.get<ApiResponse<TestSetListItem[]>>(
      TEST_ENDPOINTS.LIST_TESTSETS(testId),
      {params:payload},
    );
    return res.data;
  },
  getTestSet:async ({ testId,testSetId,...payload}: GetTestSetQueryParams): Promise<ApiResponse<TestSetListItem>> => {
    const res = await apiClient.get<ApiResponse<TestSetListItem>>(
      TEST_ENDPOINTS.GET_TESTSET_BY_ID(testId,testSetId),
      {params:payload},
    );
    return res.data;
  },
  testSetCount:async ({ testId,...payload}: GetTestSetCountQueryParams): Promise<ApiResponse<TestSetCountData>> => {
    const res = await apiClient.get<ApiResponse<TestSetCountData>>(
      TEST_ENDPOINTS.COUNT_TESTSETS(testId),
      {params:payload},
    );
    return res.data;
  },
  toggleTestSetStatus:async ({ testId,testSetId}: ToggleTestSetStatusParams): Promise<ApiResponse<ToggleTestSetStatusResponse>> => {
    const res = await apiClient.patch<ApiResponse<ToggleTestSetStatusResponse>>(
      TEST_ENDPOINTS.TOGGLE_TESTSET_STATUS(testId,testSetId),
    );
    return res.data;
  },
}