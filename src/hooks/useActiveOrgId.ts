// src/hooks/useActiveOrgId.ts
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/config/enums';
import type { ActiveOrganization } from '@/modules/user/types';

export interface ActiveOrgContext {
  orgId: string | undefined;
  activeOrg: ActiveOrganization | null;
  role: UserRole | undefined;
  isAdmin: boolean;
  isOrganization: boolean;
  isStudent: boolean;
  canManageTests: boolean;
}

export function useActiveOrgId(adminSelectedOrgId?: string): ActiveOrgContext {
  const user = useAuthStore((state) => state.user);
  const activeOrg = user?.activeOrganization ?? null;
  const role = user?.role;

  // Extract the identifier from activeOrganization
  const activeOrgId = (activeOrg as any)?.id ?? (activeOrg as any)?.org_id;

  let resolvedOrgId: string | undefined;

  switch (role) {
    case UserRole.ORGANIZATION:
    case UserRole.STUDENT:
      resolvedOrgId = activeOrgId;
      break;

    case UserRole.ADMIN:
      resolvedOrgId = adminSelectedOrgId || activeOrgId;
      break;

    default:
      resolvedOrgId = undefined;
  }

  const isOrg = role === UserRole.ORGANIZATION;
  const isStudent = role === UserRole.STUDENT;
  const isAdmin = role === UserRole.ADMIN;

  return {
    orgId: resolvedOrgId,
    activeOrg,
    role,
    isAdmin,
    isOrganization: isOrg,
    isStudent,
    canManageTests: isOrg,
  };
}