import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planService } from '../services/planService';
import { planKeys } from './plan.keys';
import type { ApiResponse } from '@/types/api.types';
import type {
  CreateOrganizationPlanInput,
  OrganizationPlanParams,
  OrganizationPlanResponse,
  RemoveOrganizationPlanResponse,
  UpdateOrganizationPlanInput,
} from '../types/subscription.types';

export interface UpdateOrganizationPlanVariables {
  params: OrganizationPlanParams;
  input: UpdateOrganizationPlanInput;
}

export function useCreateOrganizationPlan() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<OrganizationPlanResponse>,
    Error,
    CreateOrganizationPlanInput
  >({
    mutationFn: (payload: CreateOrganizationPlanInput) =>
      planService.createOrganizationPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: planKeys.organizationLists(),
      });
    },
  });
}

export function useUpdateOrganizationPlan() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<OrganizationPlanResponse>,
    Error,
    UpdateOrganizationPlanVariables
  >({
    mutationFn: ({ params, input }: UpdateOrganizationPlanVariables) =>
      planService.updateOrganizationPlan(params, input),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: planKeys.organizationLists(),
      });
      queryClient.invalidateQueries({
        queryKey: planKeys.organizationDetails(),
        predicate: (query) => query.queryKey[3] === variables.params.planId,
      });
    },
  });
}

export function useRemoveOrganizationPlan() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RemoveOrganizationPlanResponse>,
    Error,
    OrganizationPlanParams
  >({
    mutationFn: (payload: OrganizationPlanParams) =>
      planService.removeOrganizationPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: planKeys.organizationLists(),
      });
    },
  });
}