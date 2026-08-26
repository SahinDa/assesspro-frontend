// ==========================================
// 1. EXISTING ENUMS & CONST OBJECTS
// ==========================================

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

// ==========================================
// 2. SUBSCRIPTIONS & BILLING ENUMS (ADDED)
// ==========================================

export enum SupportedCurrency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
}

export enum OrgBillingCycle {
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
}

export enum StudentBillingCycle {
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
}

export enum PlatformBillingCycle {
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
}

export enum OrganizationBillingCycle {
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
}

export enum OrgSubscriptionStatus {
  Active = 1,
  Expired = 2,
  Cancelled = 3,
  OnHold = 4,
}

export enum UserSubscriptionStatus {
  Active = 1,
  Expired = 2,
  Cancelled = 3,
  OnHold = 4,
}

export enum OrgPaymentMethod {
  UPI = 1,
  Card = 2,
  NetBanking = 3,
  Wallet = 4,
  Other = 99,
}

export enum StudentPaymentMethod {
  UPI = 1,
  Card = 2,
  NetBanking = 3,
  Wallet = 4,
  Other = 99,
}

export enum OrgPaymentGateway {
  Razorpay = 1,
  Stripe = 2,
  PayPal = 3,
  CashFree = 4,
  Other = 99,
}

export enum StudentPaymentGateway {
  Razorpay = 1,
  Stripe = 2,
  PayPal = 3,
  CashFree = 4,
  Other = 99,
}

export enum OrgTransactionStatus {
  Pending = 1,
  Success = 2,
  Failed = 3,
  Refunded = 4,
}

export enum StudentTransactionStatus {
  Pending = 1,
  Success = 2,
  Failed = 3,
  Cancelled = 4,
}

// ==========================================
// 3. DYNAMIC JSONB FEATURE KEYS (ADDED)
// ==========================================

export enum PlatformSubscriptionFeatureKey {
  MAX_USERS = 'max_users',
  MAX_TESTS = 'max_tests',
  MAX_SETS_PER_TEST = 'max_sets_per_test',
  MAX_QUESTIONS_PER_SET = 'max_questions_per_set',
  MAX_USERS1 = 'max_users1',
  MAX_TESTS1 = 'max_tests1',
  MAX_SETS_PER_TEST1 = 'max_sets_per_test1',
  MAX_QUESTIONS_PER_SET1 = 'max_questions_per_set1',
}

export enum OrganizationSubscriptionFeatureKey {
  MAX_TEST_SETS = 'max_test_sets',
  MAX_REATTEMPTS = 'max_reattempts',
}

export enum PlatformPlanLimit {
  MAX_ACTIVE_PLANS = 3,
}

export enum OrganizationPlanLimit {
  MAX_ACTIVE_PLANS = 3,
}