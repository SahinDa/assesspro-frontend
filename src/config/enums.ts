export const UserRole = {
  ADMIN: 0,
  ORGANIZATION: 1,
  STUDENT: 2,
  OTHER: 3,
} as const;

// This extracts the type union (0 | 1 | 2 | 3) automatically
export type UserRoleType = typeof UserRole[keyof typeof UserRole];