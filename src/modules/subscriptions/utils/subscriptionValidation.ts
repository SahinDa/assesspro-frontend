import { z } from 'zod'
import {
  UserRole,
  type UserRoleType,
  OrgBillingCycle,
  StudentBillingCycle,
  OrgPaymentMethod,
  StudentPaymentMethod,
  OrgPaymentGateway,
  StudentPaymentGateway,
  OrgTransactionStatus,
  StudentTransactionStatus,
  OrgSubscriptionStatus,
  UserSubscriptionStatus,
  SupportedCurrency,
  PlatformSubscriptionFeatureKey,
  OrganizationSubscriptionFeatureKey,
} from '@/config/enums'

export {
  UserRole,
  type UserRoleType,
  OrgBillingCycle,
  StudentBillingCycle,
  OrgPaymentMethod,
  StudentPaymentMethod,
  OrgPaymentGateway,
  StudentPaymentGateway,
  OrgTransactionStatus,
  StudentTransactionStatus,
  OrgSubscriptionStatus,
  UserSubscriptionStatus,
  SupportedCurrency,
  PlatformSubscriptionFeatureKey,
  OrganizationSubscriptionFeatureKey,
}

// 1. Zod Form Validation Schemas
export const CreatePlatformPlanDtoSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(50),
  description: z.string().max(255).optional().or(z.literal('')),
  currency: z.nativeEnum(SupportedCurrency).default(SupportedCurrency.INR),
  pricing: z.record(z.string(), z.number().optional().nullable()),
  features: z.record(z.string(), z.number()),
})

export const CreateOrganizationPlanDtoSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(50),
  description: z.string().max(255).optional().or(z.literal('')),
  currency: z.nativeEnum(SupportedCurrency).default(SupportedCurrency.INR),
  pricing: z.record(z.string(), z.number().optional().nullable()),
  features: z.record(z.string(), z.number()),
})
// 2. TypeScript Entity Interfaces (Matching TypeORM backend)
export interface PlatformPlanEntity {
  plan_id: string
  name: string
  description?: string
  features: Record<PlatformSubscriptionFeatureKey, number | boolean>
  pricing: Record<number, number>
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrganizationPlanEntity {
  plan_id: string
  organization_id: string
  name: string
  description?: string
  pricing: Record<number, number>
  currency: string
  features: Record<OrganizationSubscriptionFeatureKey, number | boolean>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrganizationTransactionEntity {
  transaction_id: string
  organization_id: string
  plan_id: string
  plan_name: string
  billing_cycle: OrgBillingCycle
  amount: number
  currency: string
  payment_method?: OrgPaymentMethod
  payment_gateway: OrgPaymentGateway
  gateway_order_id?: string
  gateway_transaction_id?: string
  status: OrgTransactionStatus
  features: Record<PlatformSubscriptionFeatureKey, number | boolean>
  created_at: string
}

export interface StudentTransactionEntity {
  transaction_id: string
  user_id: string
  organization_id: string
  plan_id: string
  plan_name: string
  billing_cycle: StudentBillingCycle
  amount: number
  currency: string
  payment_method?: StudentPaymentMethod
  payment_gateway: StudentPaymentGateway
  gateway_order_id?: string
  gateway_transaction_id?: string
  status: StudentTransactionStatus
  features: Record<OrganizationSubscriptionFeatureKey, number | boolean>
  created_at: string
}

// 3. UI Helper Formatters
export function getBillingCycleLabel(cycle: number): string {
  switch (Number(cycle)) {
    case 1:
      return 'Monthly'
    case 2:
      return 'Quarterly'
    case 3:
      return 'Yearly'
    default:
      return 'Per Cycle'
  }
}

export function getPaymentMethodLabel(method?: number): string {
  switch (method) {
    case OrgPaymentMethod.UPI:
      return 'UPI'
    case OrgPaymentMethod.Card:
      return 'Card'
    case OrgPaymentMethod.NetBanking:
      return 'Net Banking'
    case OrgPaymentMethod.Wallet:
      return 'Wallet'
    default:
      return 'Online Gateway'
  }
}

// 4. Mock Datasets
export const MOCK_PLATFORM_PLANS: PlatformPlanEntity[] = [
  {
    plan_id: 'plat-plan-1',
    name: 'Starter Academy Tier',
    description: 'Core testing and user management infrastructure for rising institutes.',
    currency: 'INR',
    is_active: true,
    pricing: {
      [OrgBillingCycle.Monthly]: 2999,
      [OrgBillingCycle.Quarterly]: 7999,
      [OrgBillingCycle.Yearly]: 29999,
    },
    features: {
      [PlatformSubscriptionFeatureKey.MAX_USERS]: 150,
      [PlatformSubscriptionFeatureKey.MAX_TESTS]: 50,
      [PlatformSubscriptionFeatureKey.MAX_SETS_PER_TEST]: 3,
      [PlatformSubscriptionFeatureKey.MAX_QUESTIONS_PER_SET]: 60,
    },
    created_at: '2026-01-15T00:00:00.000Z',
    updated_at: '2026-01-15T00:00:00.000Z',
  },
  {
    plan_id: 'plat-plan-2',
    name: 'Enterprise Scale Tier',
    description: 'High-capacity assessment suite for multi-branch organizations.',
    currency: 'INR',
    is_active: true,
    pricing: {
      [OrgBillingCycle.Monthly]: 9999,
      [OrgBillingCycle.Quarterly]: 26999,
      [OrgBillingCycle.Yearly]: 99999,
    },
    features: {
      [PlatformSubscriptionFeatureKey.MAX_USERS]: 2500,
      [PlatformSubscriptionFeatureKey.MAX_TESTS]: 1000,
      [PlatformSubscriptionFeatureKey.MAX_SETS_PER_TEST]: 10,
      [PlatformSubscriptionFeatureKey.MAX_QUESTIONS_PER_SET]: 200,
    },
    created_at: '2026-01-15T00:00:00.000Z',
    updated_at: '2026-01-15T00:00:00.000Z',
  },
]

export const MOCK_ORGANIZATION_PLANS: OrganizationPlanEntity[] = [
  {
    plan_id: 'org-plan-1',
    organization_id: 'org-uuid-101',
    name: 'Foundation Mock Pass',
    description: 'Entry-level access for topic practice and baseline mock drills.',
    currency: 'INR',
    is_active: true,
    pricing: {
      [StudentBillingCycle.Monthly]: 299,
      [StudentBillingCycle.Quarterly]: 699,
      [StudentBillingCycle.Yearly]: 1999,
    },
    features: {
      [OrganizationSubscriptionFeatureKey.MAX_TEST_SETS]: 15,
      [OrganizationSubscriptionFeatureKey.MAX_REATTEMPTS]: 1,
    },
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: '2026-02-01T00:00:00.000Z',
  },
  {
    plan_id: 'org-plan-2',
    organization_id: 'org-uuid-101',
    name: 'Grand Test Series Pass',
    description: 'Full access to all test sets with generous reattempt allowances.',
    currency: 'INR',
    is_active: true,
    pricing: {
      [StudentBillingCycle.Monthly]: 699,
      [StudentBillingCycle.Quarterly]: 1499,
      [StudentBillingCycle.Yearly]: 3999,
    },
    features: {
      [OrganizationSubscriptionFeatureKey.MAX_TEST_SETS]: 100,
      [OrganizationSubscriptionFeatureKey.MAX_REATTEMPTS]: 3,
    },
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: '2026-02-01T00:00:00.000Z',
  },
]

export const MOCK_STUDENT_TRANSACTIONS: StudentTransactionEntity[] = [
  {
    transaction_id: 'tx-std-001',
    user_id: 'std-user-1',
    organization_id: 'org-uuid-101',
    plan_id: 'org-plan-2',
    plan_name: 'Grand Test Series Pass',
    billing_cycle: StudentBillingCycle.Yearly,
    amount: 3999.0,
    currency: 'INR',
    payment_method: StudentPaymentMethod.UPI,
    payment_gateway: StudentPaymentGateway.Razorpay,
    gateway_order_id: 'order_RZP_std_9921',
    gateway_transaction_id: 'pay_RZP_std_8831',
    status: StudentTransactionStatus.Success,
    features: {
      [OrganizationSubscriptionFeatureKey.MAX_TEST_SETS]: 100,
      [OrganizationSubscriptionFeatureKey.MAX_REATTEMPTS]: 3,
    },
    created_at: '2026-08-20T10:15:30.000Z',
  },
  {
    transaction_id: 'tx-std-002',
    user_id: 'std-user-2',
    organization_id: 'org-uuid-101',
    plan_id: 'org-plan-1',
    plan_name: 'Foundation Mock Pass',
    billing_cycle: StudentBillingCycle.Monthly,
    amount: 299.0,
    currency: 'INR',
    payment_method: StudentPaymentMethod.Card,
    payment_gateway: StudentPaymentGateway.Razorpay,
    gateway_order_id: 'order_RZP_std_4421',
    gateway_transaction_id: 'pay_RZP_std_3311',
    status: StudentTransactionStatus.Pending,
    features: {
      [OrganizationSubscriptionFeatureKey.MAX_TEST_SETS]: 15,
      [OrganizationSubscriptionFeatureKey.MAX_REATTEMPTS]: 1,
    },
    created_at: '2026-08-26T04:20:00.000Z',
  },
]

export const MOCK_ORG_TRANSACTIONS: OrganizationTransactionEntity[] = [
  {
    transaction_id: 'tx-org-001',
    organization_id: 'org-uuid-101',
    plan_id: 'plat-plan-2',
    plan_name: 'Enterprise Scale Tier',
    billing_cycle: OrgBillingCycle.Monthly,
    amount: 9999.0,
    currency: 'INR',
    payment_method: OrgPaymentMethod.NetBanking,
    payment_gateway: OrgPaymentGateway.Razorpay,
    gateway_order_id: 'order_RZP_org_5510',
    gateway_transaction_id: 'pay_RZP_org_7720',
    status: OrgTransactionStatus.Success,
    features: {
      [PlatformSubscriptionFeatureKey.MAX_USERS]: 2500,
      [PlatformSubscriptionFeatureKey.MAX_TESTS]: 1000,
      [PlatformSubscriptionFeatureKey.MAX_SETS_PER_TEST]: 10,
      [PlatformSubscriptionFeatureKey.MAX_QUESTIONS_PER_SET]: 200,
    },
    created_at: '2026-08-01T12:00:00.000Z',
  },
]