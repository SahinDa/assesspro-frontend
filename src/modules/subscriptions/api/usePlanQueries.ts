import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
  } from '@tanstack/react-query';
  import { planService } from '../services/planService';
  import { planKeys } from './plan.keys';
  import { useActiveOrgId } from '@/hooks/useActiveOrgId';
  import type {
    CreateOrganizationPlanInput,
    OrganizationPlanParams,
    OrganizationPlanResponse,
    UpdateOrganizationPlanInput,
  } from '../types/subscription.types';
  
  // 1. Fetch all organization plans (Organization & Student)
  export function useOrganizationPlansQuery(adminOrgId?: string) {
    const { orgId } = useActiveOrgId(adminOrgId);
  
    return useQuery({
      queryKey: planKeys.organizationList(orgId),
      queryFn: () => planService.getAllOrganizationPlans(),
      select: (res): OrganizationPlanResponse[] => res.data,
      placeholderData: keepPreviousData,
      enabled: Boolean(orgId),
      staleTime: 1000 * 60 * 2, // 2 minutes
    });
  }
  
  // 2. Fetch single organization plan by ID
  export function useOrganizationPlanByIdQuery(
    params: OrganizationPlanParams,
    adminOrgId?: string,
  ) {
    const { orgId } = useActiveOrgId(adminOrgId);
  
    return useQuery({
      queryKey: planKeys.organizationDetail(params.planId, orgId),
      queryFn: () => planService.getOrganizationPlanById(params),
      select: (res): OrganizationPlanResponse => res.data,
      enabled: Boolean(params.planId),
      staleTime: 1000 * 60 * 2,
    });
  }
  
  // 3. Create organization plan (Organization role)
  export function useCreateOrganizationPlanMutation(adminOrgId?: string) {
    const queryClient = useQueryClient();
    const { orgId } = useActiveOrgId(adminOrgId);
  
    return useMutation({
      mutationFn: (input: CreateOrganizationPlanInput) =>
        planService.createOrganizationPlan({
          ...input,
          organization_id: input.organization_id ?? orgId,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: planKeys.organizationLists(),
        });
      },
    });
  }
  
  // 4. Update organization plan (Organization role)
  export function useUpdateOrganizationPlanMutation() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        params,
        input,
      }: {
        params: OrganizationPlanParams;
        input: UpdateOrganizationPlanInput;
      }) => planService.updateOrganizationPlan(params, input),
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
  
  // 5. Soft-remove organization plan (Organization role)
  export function useRemoveOrganizationPlanMutation() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (params: OrganizationPlanParams) =>
        planService.removeOrganizationPlan(params),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: planKeys.organizationLists(),
        });
      },
    });
  }