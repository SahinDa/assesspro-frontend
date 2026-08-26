import { useState } from 'react'
import { Plus, Sparkles, Layers, ShieldCheck, AlertCircle } from 'lucide-react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import {
  PlatformPlanLimit,
  OrganizationPlanLimit,
} from '@/config/enums'

import PlanCard from '../components/PlanCard'
import PlanFormDialog from '../components/PlanFormDialog'
import CheckoutDialog from '../components/CheckoutDialog'
import {
  UserRole,
  type UserRoleType,
  MOCK_PLATFORM_PLANS,
  MOCK_ORGANIZATION_PLANS,
  type PlatformPlanEntity,
  type OrganizationPlanEntity,
} from '../utils/subscriptionValidation'

interface PlansViewProps {
  userRole?: UserRoleType
}

export default function PlansView({ userRole = UserRole.ORGANIZATION }: PlansViewProps) {
  // State management for plans
  const [platformPlans, setPlatformPlans] = useState<PlatformPlanEntity[]>(MOCK_PLATFORM_PLANS)
  const [orgPlans, setOrgPlans] = useState<OrganizationPlanEntity[]>(MOCK_ORGANIZATION_PLANS)

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlatformPlanEntity | OrganizationPlanEntity | null>(null)

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<
    PlatformPlanEntity | OrganizationPlanEntity | null
  >(null)

  // Separate Plan Limit Enums
  const maxPlatformPlans = PlatformPlanLimit.MAX_ACTIVE_PLANS
  const maxOrgPlans = OrganizationPlanLimit.MAX_ACTIVE_PLANS

  // Plan limit calculations
  const activePlatformPlansCount = platformPlans.filter((p) => p.is_active).length
  const activeOrgPlansCount = orgPlans.filter((p) => p.is_active).length

  const isPlatformLimitReached = activePlatformPlansCount >= maxPlatformPlans
  const isOrgLimitReached = activeOrgPlansCount >= maxOrgPlans

  // Handlers
  const handleCreatePlan = () => {
    setEditingPlan(null)
    setIsFormOpen(true)
  }

  const handleEditPlan = (plan: PlatformPlanEntity | OrganizationPlanEntity) => {
    setEditingPlan(plan)
    setIsFormOpen(true)
  }

  const handleSubscribe = (plan: PlatformPlanEntity | OrganizationPlanEntity) => {
    setSelectedPlanForCheckout(plan)
    setIsCheckoutOpen(true)
  }

  const handleSavePlan = (formData: any) => {
    if (userRole === UserRole.ADMIN) {
      if (editingPlan) {
        setPlatformPlans((prev) =>
          prev.map((p) => (p.plan_id === editingPlan.plan_id ? { ...p, ...formData } : p))
        )
      } else {
        const newPlan: PlatformPlanEntity = {
          plan_id: `plat-plan-${Date.now()}`,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...formData,
        }
        setPlatformPlans((prev) => [...prev, newPlan])
      }
    } else {
      if (editingPlan) {
        setOrgPlans((prev) =>
          prev.map((p) => (p.plan_id === editingPlan.plan_id ? { ...p, ...formData } : p))
        )
      } else {
        const newPlan: OrganizationPlanEntity = {
          plan_id: `org-plan-${Date.now()}`,
          organization_id: 'org-uuid-101',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...formData,
        }
        setOrgPlans((prev) => [...prev, newPlan])
      }
    }
  }

  return (
    <main className="w-full max-w-6xl mx-auto space-y-8 pb-24 px-2 sm:px-0">
      {/* Header */}
      {/* Hero Header Section */}
<header className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card to-indigo-950/10 p-6 sm:p-8 shadow-xs">
  {/* Subtle Background Glow Accent */}
  <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    <div className="space-y-3 max-w-2xl">
      {/* Role Context Pill */}
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold tracking-wide uppercase">
        {userRole === UserRole.ADMIN ? (
          <>
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Platform Governance</span>
          </>
        ) : userRole === UserRole.ORGANIZATION ? (
          <>
            <Layers className="h-3.5 w-3.5" />
            <span>Institute Billing & Tiers</span>
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" />
            <span>Student Membership</span>
          </>
        )}
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {userRole === UserRole.ADMIN
            ? 'Subscription Architecture'
            : userRole === UserRole.ORGANIZATION
            ? 'Plans & Student Monetization'
            : 'Access Passes & Subscriptions'}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
          {userRole === UserRole.ADMIN
            ? 'Manage global B2B subscription tiers, set resource allocations, and define standard feature quotas.'
            : userRole === UserRole.ORGANIZATION
            ? 'Scale your academy testing capacity and configure customizable access tiers for enrolled students.'
            : 'Unlock verified mock tests, unlimited drill reattempts, and comprehensive analytics.'}
        </p>
      </div>

      {/* Quota Indicator Bar (Admin & Org only) */}
      {userRole !== UserRole.STUDENT && (
        <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Active Tiers:</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold bg-muted/60 px-2 py-0.5 rounded-md border border-border/60">
            <span className={userRole === UserRole.ADMIN ? (isPlatformLimitReached ? 'text-amber-600' : 'text-indigo-600') : (isOrgLimitReached ? 'text-amber-600' : 'text-indigo-600')}>
              {userRole === UserRole.ADMIN ? activePlatformPlansCount : activeOrgPlansCount}
            </span>
            <span className="text-muted-foreground">/</span>
            <span>{userRole === UserRole.ADMIN ? maxPlatformPlans : maxOrgPlans} Max</span>
          </div>
        </div>
      )}
    </div>

    {/* Admin Top-Right Action Button */}
    {userRole === UserRole.ADMIN && (
      <div className="shrink-0 flex items-center">
        <Button
          onClick={handleCreatePlan}
          disabled={isPlatformLimitReached}
          className="h-10 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Platform Plan</span>
        </Button>
      </div>
    )}
  </div>
</header>

      <Separator />

      {/* 1. Super Admin View */}
      {userRole === UserRole.ADMIN && (
        <div className="space-y-4">
          {isPlatformLimitReached && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                Maximum active plan limit ({maxPlatformPlans}/{maxPlatformPlans}) reached. Edit existing plans or archive one before creating a new tier.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformPlans.map((plan) => (
              <PlanCard
                key={plan.plan_id}
                plan={plan}
                isPlatformPlan={true}
                userRole={userRole}
                onEdit={() => handleEditPlan(plan)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Organization View (Tabs) */}
      {userRole === UserRole.ORGANIZATION && (
        <Tabs defaultValue="platform_tiers" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="bg-muted/60 p-1 rounded-xl">
              <TabsTrigger value="platform_tiers" className="text-xs font-bold rounded-lg">
                Institute Plans & Upgrades
              </TabsTrigger>
              <TabsTrigger value="student_plans" className="text-xs font-bold rounded-lg">
                Student Pricing Tiers ({activeOrgPlansCount}/{maxOrgPlans})
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={handleCreatePlan}
              disabled={isOrgLimitReached}
              size="sm"
              className="rounded-xl text-xs font-bold h-9 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-xs shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>
                {isOrgLimitReached
                  ? `Plan Limit Reached (${activeOrgPlansCount}/${maxOrgPlans})`
                  : `Create Student Tier (${activeOrgPlansCount}/${maxOrgPlans})`}
              </span>
            </Button>
          </div>

          {/* Org: Platform Plans to upgrade their own capacity */}
          <TabsContent value="platform_tiers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformPlans.map((plan) => (
                <PlanCard
                  key={plan.plan_id}
                  plan={plan}
                  isPlatformPlan={true}
                  userRole={userRole}
                  onSubscribe={() => handleSubscribe(plan)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Org: Student Plans created for enrolled students */}
          <TabsContent value="student_plans" className="space-y-4">
            {isOrgLimitReached && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  Maximum active student plans reached ({maxOrgPlans}/{maxOrgPlans}). Deactivate or edit a tier to publish a new one.
                </span>
              </div>
            )}

            {orgPlans.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl border-border/80">
                <p className="text-sm font-semibold text-muted-foreground">No student plans created yet.</p>
                <Button
                  variant="link"
                  onClick={handleCreatePlan}
                  className="text-indigo-600 text-xs mt-1 cursor-pointer"
                >
                  Create your first student tier
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orgPlans.map((plan) => (
                  <PlanCard
                    key={plan.plan_id}
                    plan={plan}
                    isPlatformPlan={false}
                    userRole={userRole}
                    onEdit={() => handleEditPlan(plan)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* 3. Student View */}
      {userRole === UserRole.STUDENT && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgPlans.map((plan) => (
            <PlanCard
              key={plan.plan_id}
              plan={plan}
              isPlatformPlan={false}
              userRole={userRole}
              onSubscribe={() => handleSubscribe(plan)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <PlanFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        planToEdit={editingPlan}
        isPlatformPlan={userRole === UserRole.ADMIN}
        onSubmit={handleSavePlan}
      />

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        plan={selectedPlanForCheckout}
        onPaymentSuccess={() => {
          setIsCheckoutOpen(false)
        }}
      />
    </main>
  )
}