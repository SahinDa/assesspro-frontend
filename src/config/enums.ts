export const UserRole = {
  ADMIN: 0,
  ORGANIZATION: 1,
  STUDENT: 2,
  OTHER: 3,
} as const;

// This extracts the type union (0 | 1 | 2 | 3) automatically
export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const JoinRequestStatus = {
  PENDING: 0,
  REJECTED: 1,
  APPROVED: 2,
} as const;

// Extracts the union type: 0 | 1 | 2
export type JoinRequestStatusType = typeof JoinRequestStatus[keyof typeof JoinRequestStatus]

export const BookmarkType = {
  TEST: 1,
  TEST_SET: 2,
} as const;

export type BookmarkTypeEnum = (typeof BookmarkType)[keyof typeof BookmarkType];

export enum CorrectAnswer {
  A = 1,
  B = 2,
  C = 3,
  D = 4,
}

export enum NegativeMarkingOption {
  ZERO = 0.0,
  QUARTER = 0.25,
  HALF = 0.5,
  ONE = 1.0,
}