export const SUBSCRIPTION_ENDPOINTS = {
    CREATE_ORGANIZATION_PLAN: '/subscription/organization',
    GET_ALL_ORGANIZATION_PLANS: '/subscription/organization/all',
    GET_ORGANIZATION_PLAN_BY_ID: (planId: string) =>
      `/subscription/organization/${planId}`,
    UPDATE_ORGANIZATION_PLAN: (planId: string) =>
      `/subscription/organization/${planId}`,
    REMOVE_ORGANIZATION_PLAN: (planId: string) =>
      `/subscription/organization/${planId}`,
  } as const;