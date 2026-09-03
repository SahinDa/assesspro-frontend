import { z } from 'zod';
import {
  OrganizationStatus,
  type OrganizationStatusEnum,
  OrgSubscriptionStatus,
} from '@/config/enums';

export { OrganizationStatus, OrgSubscriptionStatus };
export type { OrganizationStatusEnum };

export const OrganizationStatusMeta: Record<
  OrganizationStatusEnum,
  { label: string; badgeClass: string; dotClass: string; description: string }
> = {
  [OrganizationStatus.ON_HOLD]: {
    label: 'On Hold',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
    description: 'Tenant temporarily suspended or pending verification',
  },
  [OrganizationStatus.ACTIVE]: {
    label: 'Active',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    description: 'Operational and eligible to host assessments',
  },
  [OrganizationStatus.DELETED]: {
    label: 'Deleted',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    description: 'Soft-deleted tenant account',
  },
};

export const OrgSubscriptionStatusMeta: Record<
  OrgSubscriptionStatus,
  { label: string; badgeClass: string }
> = {
  [OrgSubscriptionStatus.Active]: {
    label: 'Subscription Active',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  [OrgSubscriptionStatus.Expired]: {
    label: 'Subscription Expired',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  [OrgSubscriptionStatus.Cancelled]: {
    label: 'Subscription Cancelled',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  [OrgSubscriptionStatus.OnHold]: {
    label: 'Subscription On Hold',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
};

export const OrgItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(150),
  status: z.nativeEnum(OrganizationStatus),
  subscription_status: z.nativeEnum(OrgSubscriptionStatus).default(OrgSubscriptionStatus.Active),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
  owner_name: z.string().default('Organization Owner'),
  owner_email: z.string().email().optional(),
  members_count: z.number().int().nonnegative().default(0),
  tests_count: z.number().int().nonnegative().default(0),
  attempts_count: z.number().int().nonnegative().default(0),
});

export type OrgItem = z.infer<typeof OrgItemSchema>;

export const UpdateOrgStatusSchema = z.object({
  status: z.nativeEnum(OrganizationStatus),
});

export type UpdateOrgStatusDto = z.infer<typeof UpdateOrgStatusSchema>;