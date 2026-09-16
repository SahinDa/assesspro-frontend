import { UserRole, type UserRoleType } from '@/config/enums';

/**
 * Returns true if the user has no role assigned or is still in the onboarding state (OTHER = 3).
 */
export function isUserUnassigned(role?: UserRoleType | number | null): boolean {
  return role === null || role === undefined || role === UserRole.OTHER;
}

/**
 * Returns the correct home path based on the user's role.
 */
export function getHomePathForRole(role?: UserRoleType | number | null): string {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin/overview';
    case UserRole.ORGANIZATION:
      return '/dashboard/organization';
    case UserRole.STUDENT:
      return '/student/dashboard';
    case UserRole.OTHER:
      return '/role-selection';
    default:
      return '/signin';
  }
}