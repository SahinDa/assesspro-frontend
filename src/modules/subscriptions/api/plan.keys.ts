export const planKeys = {
    all: ['plans'] as const,
  
    // Organization-to-Student Plans
    organization: () => [...planKeys.all, 'organization'] as const,
    organizationLists: () => [...planKeys.organization(), 'list'] as const,
    organizationList: (orgId?: string) =>
      [...planKeys.organizationLists(), { orgId }] as const,
    organizationDetails: () => [...planKeys.organization(), 'detail'] as const,
    organizationDetail: (planId: string, orgId?: string) =>
      [...planKeys.organizationDetails(), planId, { orgId }] as const,
  };