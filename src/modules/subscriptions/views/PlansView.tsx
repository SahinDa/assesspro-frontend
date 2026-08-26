import { useState } from 'react'
import { Plus, Sparkles, Layers } from 'lucide-react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

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
  currentOrgId?: string | null
  currentPlanId?: string
}

export default function PlansView({
  userRole = UserRole.ORGANIZATION,
  currentOrgId = 'org-uuid-101',
  currentPlanId = 'plat-plan-2',
}: PlansViewProps) {
  const [platformPlans, setPlatformPlans] = useState<PlatformPlanEntity[]>(MOCK_PLATFORM_PLANS)
  const [orgPlans, setOrgPlans] = useState<OrganizationPlanEntity[]>(MOCK_ORGANIZATION_PLANS)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlatformPlanEntity | OrganizationPlanEntity | null>(null)
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    plan: PlatformPlanEntity | OrganizationPlanEntity
    cycle: number
  } | null>(null)

  const handleSavePlan = (formData: any) => {
    if (editingPlan) {
      if ('organization_id' in editingPlan) {
        setOrgPlans((prev) =>
          prev.map((p) => (p.plan_id === editingPlan.plan_id ? { ...p, ...formData } : p))
        )
      } else {
        setPlatformPlans((prev) =>
          prev.map((p) => (p.plan_id === editingPlan.plan_id ? { ...p, ...formData } : p))
        )
      }
    } else {
      if (userRole === UserRole.ORGANIZATION) {
        const newOrgPlan: OrganizationPlanEntity = {
          plan_id: `org-plan-${Date.now()}`,
          organization_id: currentOrgId || 'org-uuid-101',
          name: formData.name,
          description: formData.description,
          pricing: formData.pricing,
          currency: formData.currency,
          features: formData.features,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setOrgPlans((prev) => [newOrgPlan, ...prev])
      } else {
        const newPlatPlan: PlatformPlanEntity = {
          plan_id: `plat-plan-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          pricing: formData.pricing,
          currency: formData.currency,
          features: formData.features,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setPlatformPlans((prev) => [newPlatPlan, ...prev])
      }
    }
    setEditingPlan(null)
  }

  const handleDeletePlan = (planId: string) => {
    setOrgPlans((prev) => prev.filter((p) => p.plan_id !== planId))
    setPlatformPlans((prev) => prev.filter((p) => p.plan_id !== planId))
  }

  return (
    <main className="w-full max-w-5xl mx-auto space-y-8 pb-24 px-2 sm:px-0">
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardHeader className="p-0 space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight text-foreground">
              Subscription Plans
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground whitespace-nowrap">
              {userRole === UserRole.STUDENT
                ? 'Unlock full-length test series, live proctoring, and comprehensive analytics.'
                : userRole === UserRole.ORGANIZATION
                ? 'Manage student test packages and platform subscription tiers.'
                : 'Configure platform tiers and capacity limits for subscriber organizations.'}
            </CardDescription>
          </CardHeader>

          {userRole !== UserRole.STUDENT && (
            <Button
              size="sm"
              onClick={() => {
                setEditingPlan(null)
                setIsFormOpen(true)
              }}
              className="rounded-xl text-xs font-bold h-9 bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{userRole === UserRole.ORGANIZATION ? 'Create Student Plan' : 'Create Platform Tier'}</span>
            </Button>
          )}
        </div>
        <Separator />
      </header>

      {userRole === UserRole.ORGANIZATION ? (
        <Tabs defaultValue="student_plans" className="space-y-6">
          <TabsList className="bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="student_plans" className="text-xs font-bold rounded-lg gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Student Packages ({orgPlans.length})</span>
            </TabsTrigger>
            <TabsTrigger value="platform_tier" className="text-xs font-bold rounded-lg gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>Organization Platform Tier</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student_plans" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {orgPlans.map((plan) => (
              <PlanCard
                key={plan.plan_id}
                plan={plan}
                isPlatformPlan={false}
                userRole={userRole}
                currentOrgId={currentOrgId}
                onSelectPlan={(p, c) => setSelectedPlanForCheckout({ plan: p, cycle: c })}
                onEditPlan={(p) => {
                  setEditingPlan(p)
                  setIsFormOpen(true)
                }}
                onDeletePlan={handleDeletePlan}
              />
            ))}
          </TabsContent>

          <TabsContent value="platform_tier" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {platformPlans.map((plan) => (
              <PlanCard
                key={plan.plan_id}
                plan={plan}
                isPlatformPlan={true}
                userRole={userRole}
                currentOrgId={currentOrgId}
                isCurrent={plan.plan_id === currentPlanId}
                onSelectPlan={(p, c) => setSelectedPlanForCheckout({ plan: p, cycle: c })}
              />
            ))}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(userRole === UserRole.STUDENT ? orgPlans : platformPlans).map((plan) => (
            <PlanCard
              key={plan.plan_id}
              plan={plan}
              isPlatformPlan={userRole === UserRole.ADMIN}
              userRole={userRole}
              currentOrgId={currentOrgId}
              isCurrent={plan.plan_id === currentPlanId}
              onSelectPlan={(p, c) => setSelectedPlanForCheckout({ plan: p, cycle: c })}
              onEditPlan={(p) => {
                setEditingPlan(p)
                setIsFormOpen(true)
              }}
              onDeletePlan={handleDeletePlan}
            />
          ))}
        </div>
      )}

      {/* Plan Builder Dialog */}
      <PlanFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        planToEdit={editingPlan}
        isPlatformPlan={userRole === UserRole.ADMIN}
        onSubmit={handleSavePlan}
      />

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={!!selectedPlanForCheckout}
        onOpenChange={(open) => !open && setSelectedPlanForCheckout(null)}
        plan={selectedPlanForCheckout?.plan ?? null}
        billingCycle={selectedPlanForCheckout?.cycle ?? 1}
        userRole={userRole}
        onPaymentSuccess={() => setSelectedPlanForCheckout(null)}
      />
    </main>
  )
}