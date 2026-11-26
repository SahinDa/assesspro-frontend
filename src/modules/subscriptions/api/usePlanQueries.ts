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
      queryFn: () => planService.getAllOrganizationPlans({orgId}),
      select: (res): OrganizationPlanResponse[] => res.data,
      placeholderData: keepPreviousData,
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
      queryFn: () => planService.getOrganizationPlanById(params,{orgId}),
      select: (res): OrganizationPlanResponse => res.data,
      enabled: Boolean(params.planId),
      staleTime: 1000 * 60 * 2,
    });
  }
  
