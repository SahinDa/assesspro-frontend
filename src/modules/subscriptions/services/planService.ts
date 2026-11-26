import { apiClient } from '@/lib/apiClient';
import { SUBSCRIPTION_ENDPOINTS } from '../constants/endpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  CreateOrganizationPlanInput,
  OrganizationPlanQuery,
  OrganizationPlanParams,
  OrganizationPlanResponse,
  RemoveOrganizationPlanResponse,
  UpdateOrganizationPlanInput,
} from '../types/subscription.types';

export const planService = {
  createOrganizationPlan: async (
    input: CreateOrganizationPlanInput,
  ): Promise<ApiResponse<OrganizationPlanResponse>> => {
    const res = await apiClient.post<ApiResponse<OrganizationPlanResponse>>(
      SUBSCRIPTION_ENDPOINTS.CREATE_ORGANIZATION_PLAN,
      input,
    );
    return res.data;
  },

  getAllOrganizationPlans: async (params?:OrganizationPlanQuery ): Promise<
    ApiResponse<OrganizationPlanResponse[]>
  > => {
    const res = await apiClient.get<ApiResponse<OrganizationPlanResponse[]>>(
      SUBSCRIPTION_ENDPOINTS.GET_ALL_ORGANIZATION_PLANS,
     {params}
    );
    return res.data;
  },

  getOrganizationPlanById: async (
    params: OrganizationPlanParams,
    query?:OrganizationPlanQuery ,
  ): Promise<ApiResponse<OrganizationPlanResponse>> => {
    const res = await apiClient.get<ApiResponse<OrganizationPlanResponse>>(
      SUBSCRIPTION_ENDPOINTS.GET_ORGANIZATION_PLAN_BY_ID(params.planId),
      {params:query}
    );
    return res.data;
  },

  updateOrganizationPlan: async (
    params: OrganizationPlanParams,
    input: UpdateOrganizationPlanInput,
  ): Promise<ApiResponse<OrganizationPlanResponse>> => {
    const res = await apiClient.patch<ApiResponse<OrganizationPlanResponse>>(
      SUBSCRIPTION_ENDPOINTS.UPDATE_ORGANIZATION_PLAN(params.planId),
      input,
    );
    return res.data;
  },

  removeOrganizationPlan: async (
    params: OrganizationPlanParams,
  ): Promise<ApiResponse<RemoveOrganizationPlanResponse>> => {
    const res = await apiClient.delete<
      ApiResponse<RemoveOrganizationPlanResponse>
    >(SUBSCRIPTION_ENDPOINTS.REMOVE_ORGANIZATION_PLAN(params.planId));
    return res.data;
  },
};