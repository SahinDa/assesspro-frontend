import { apiClient } from '@/lib/apiClient';
import { STUDENT_ENDPOINTS } from '../constants/endpoints';
import type {
  StudentListQueryParams,
  StudentCountQueryParams,
  HandleJoinRequestParams,
  RemoveOrgUserParams,
  SearchStudentsQueryParams,
  ActiveOrgUserResponse,
  JoinRequestUserResponse,
  OrgUsersCountResponse,
  HandleJoinRequestResponse,
  RemoveOrgUserResponse,
  SearchStudentsResponse,
} from '../types/student.types';
import type { ApiResponse } from '@/types/api.types';

export const studentService = {
  getActiveStudents: async (
    params?: StudentListQueryParams
  ): Promise<ApiResponse<ActiveOrgUserResponse[]>> => {
    const res = await apiClient.get<ApiResponse<ActiveOrgUserResponse[]>>(
      STUDENT_ENDPOINTS.ACTIVE_STUDENTS_LIST,
      { params }
    );
    return res.data;
  },

  getStudentsCount: async (
    params?: StudentCountQueryParams
  ): Promise<ApiResponse<OrgUsersCountResponse>> => {
    const res = await apiClient.get<ApiResponse<OrgUsersCountResponse>>(
      STUDENT_ENDPOINTS.STUDENTS_COUNT,
      { params }
    );
    return res.data;
  },

  searchStudents: async (
    params: SearchStudentsQueryParams
  ): Promise<ApiResponse<SearchStudentsResponse>> => {
    const res = await apiClient.get<ApiResponse<SearchStudentsResponse>>(
      STUDENT_ENDPOINTS.SEARCH_STUDENTS,
      { params }
    );
    return res.data;
  },

  getPendingStudents: async (
    params?: StudentListQueryParams
  ): Promise<ApiResponse<JoinRequestUserResponse[]>> => {
    const res = await apiClient.get<ApiResponse<JoinRequestUserResponse[]>>(
      STUDENT_ENDPOINTS.PENDING_STUDENTS_LIST,
      { params }
    );
    return res.data;
  },

  getRejectedStudents: async (
    params?: StudentListQueryParams
  ): Promise<ApiResponse<JoinRequestUserResponse[]>> => {
    const res = await apiClient.get<ApiResponse<JoinRequestUserResponse[]>>(
      STUDENT_ENDPOINTS.REJECTED_STUDENTS_LIST,
      { params }
    );
    return res.data;
  },

  handleStudentRequest: async ({
    requestId,
    payload,
  }: HandleJoinRequestParams): Promise<ApiResponse<HandleJoinRequestResponse>> => {
    const res = await apiClient.patch<ApiResponse<HandleJoinRequestResponse>>(
      STUDENT_ENDPOINTS.HANDLE_STUDENTS_REQUEST(requestId),
      payload
    );
    return res.data;
  },

  removeStudent: async ({
    userId,
  }: RemoveOrgUserParams): Promise<ApiResponse<RemoveOrgUserResponse>> => {
    const res = await apiClient.delete<ApiResponse<RemoveOrgUserResponse>>(
      STUDENT_ENDPOINTS.REMOVE_STUDENT(userId)
    );
    return res.data;
  },
};