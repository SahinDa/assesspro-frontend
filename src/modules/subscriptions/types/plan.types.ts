import {
    OrganizationBillingCycle,
    OrganizationSubscriptionFeatureKey,
    SupportedCurrency,
  } from '@/config/enums';
  
  export type OrganizationPlanPricing = Partial<
    Record<OrganizationBillingCycle, number>
  >;
  
  export type OrganizationPlanFeatures = Partial<
    Record<OrganizationSubscriptionFeatureKey, number | boolean>
  >;
  
  export interface OrganizationPlanResponse {
    plan_id: string;
    organization_id: string;
    name: string;
    description?: string | null;
    pricing: OrganizationPlanPricing;
    currency: SupportedCurrency | string;
    features: OrganizationPlanFeatures;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateOrganizationPlanInput {
    organization_id?: string;
    name: string;
    description?: string;
    pricing: OrganizationPlanPricing;
    currency?: SupportedCurrency | string;
    features: OrganizationPlanFeatures;
  }
  
  export interface OrganizationPlanParams {
    planId: string;
  }
  
  export interface OrganizationPlanQuery {
    orgId?: string;
  }
  export interface UpdateOrganizationPlanInput {
    name?: string;
    description?: string;
    pricing?: OrganizationPlanPricing;
    currency?: SupportedCurrency | string;
    features?: OrganizationPlanFeatures;
  }
  
  export interface RemoveOrganizationPlanResponse {
    message: string;
  }