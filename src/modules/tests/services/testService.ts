import { apiClient } from '@/lib/apiClient';
import { TEST_ENDPOINTS } from '../constants/endpoints';
import type{
  CreateTestPayload,
  CreateTestResponse,
  GetTestCountQueryParams,
  TestCountData,
  GetTestListQueryParams,
  TestListItem,
  GetTestParams,
  TestDetailData,
  UpdateTestDto,
  UpdateTestParams,
  UpdateTestResponse,
  ToggleTestStatusParams,
  ToggleTestStatusResponse,
  DeleteTestParams,
  DeleteTestResponse,

 } from '../types/test.types';
 import type { ApiResponse } from '@/types/api.types';

export const testService = {
  createTest: async (payload: CreateTestPayload): Promise<ApiResponse<CreateTestResponse>> => {
      const res = await apiClient.post<ApiResponse<CreateTestResponse>>(TEST_ENDPOINTS.CREATE,payload);
      return res.data;
    },
  updateTest: async ({testId,payload}: UpdateTestParams): Promise<ApiResponse<UpdateTestResponse>> => {
    const res = await apiClient.patch<ApiResponse<UpdateTestResponse>>(
      TEST_ENDPOINTS.UPDATE(testId),
      payload
      );
    return res.data;
  },
  toggleTestStatus: async ({
    testId,
  }: ToggleTestStatusParams): Promise<ApiResponse<ToggleTestStatusResponse>> => {
    const res = await apiClient.patch<ApiResponse<ToggleTestStatusResponse>>(
      TEST_ENDPOINTS.TOGGLETESTSTATUS(testId),
    );
    return res.data;
  },
  deleteTest:async ({testId}: DeleteTestParams): Promise<ApiResponse<DeleteTestResponse>> => {
    const res = await apiClient.delete<ApiResponse<DeleteTestResponse>>(
      TEST_ENDPOINTS.DELETE(testId)
      );
    return res.data;
  },
  testList:async (payload:GetTestListQueryParams): Promise<ApiResponse<TestListItem[]>> => {
    const res = await apiClient.get<ApiResponse<TestListItem[]>>(
      TEST_ENDPOINTS.LIST,
      {params:payload},
      );
    return res.data;
  },
  getTest:async ({testId,id}:GetTestParams): Promise<ApiResponse<TestDetailData>> => {
    const res = await apiClient.get<ApiResponse<TestDetailData>>(
      TEST_ENDPOINTS.GET_BY_ID(testId),
      { params: id ? { id } : undefined },
      );
    return res.data;
  },
  testCount:async (payload:GetTestCountQueryParams): Promise<ApiResponse<TestCountData>> => {
    const res = await apiClient.get<ApiResponse<TestCountData>>(
      TEST_ENDPOINTS.COUNT,
      {params:payload},
      );
    return res.data;
  },
}