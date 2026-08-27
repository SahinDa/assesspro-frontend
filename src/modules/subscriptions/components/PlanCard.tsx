import { useState } from 'react'
import { Check, Zap, Edit3, Trash2, Lock, AlertTriangle} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  UserRole,
  type UserRoleType,
  type PlatformPlanEntity,
  type OrganizationPlanEntity,
  getBillingCycleLabel,
} from '../utils/subscriptionValidation'

interface PlanCardProps {
  plan: PlatformPlanEntity | OrganizationPlanEntity
  isPlatformPlan: boolean
  isCurrent?: boolean
  userRole: UserRoleType
  currentOrgId: string | null
  onSelectPlan?: (plan: PlatformPlanEntity | OrganizationPlanEntity, cycle: number) => void
  onEditPlan?: (plan: PlatformPlanEntity | OrganizationPlanEntity) => void
  onDeletePlan?: (planId: string) => void
}

export default function PlanCard({
  plan,
  isPlatformPlan,
  isCurrent = false,
  userRole,
  currentOrgId,
  onSelectPlan,
  onEditPlan,
  onDeletePlan,
}: PlanCardProps) {
  const availableCycles = Object.keys(plan.pricing).map(Number)
  const [selectedCycle, setSelectedCycle] = useState<number>(availableCycles[0] || 1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const currentPrice = plan.pricing[selectedCycle] ?? 0

  const canEdit =
    (userRole === UserRole.ADMIN && isPlatformPlan) ||
    (userRole === UserRole.ORGANIZATION &&
      !isPlatformPlan &&
      (plan as OrganizationPlanEntity).organization_id === currentOrgId)

const handleConfirmDelete = () => {
  onDeletePlan?.(plan.plan_id)
  setIsDeleteDialogOpen(false)
}

  return (
    <>
    <Card
      style={{
        padding: '24px',
        marginBottom: '16px',
      }}
      className={`relative w-full rounded-2xl flex flex-col justify-between transition-all duration-150 ${
        isCurrent ? 'bg-indigo-50/20 border-indigo-300 ring-1 ring-indigo-500/20' : 'bg-card border-border shadow-xs'
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <CardHeader className="p-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl font-black tracking-tight text-foreground">
              {plan.name}
            </CardTitle>
            {isCurrent && (
              <Badge variant="outline" className="border-indigo-300 text-indigo-700 bg-indigo-50 text-[10px] font-bold">
                Active Tier
              </Badge>
            )}
          </div>
          {plan.description && (
            <CardDescription className="text-xs text-muted-foreground line-clamp-2">
              {plan.description}
            </CardDescription>
          )}
        </CardHeader>

        {/* Dynamic Billing Cycle Selector */}
        {availableCycles.length > 1 && (
          <div className="flex gap-1.5 p-1 bg-muted/60 rounded-xl">
            {availableCycles.map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setSelectedCycle(cycle)}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  selectedCycle === cycle
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {getBillingCycleLabel(cycle)}
              </button>
            ))}
          </div>
        )}

        {/* Pricing Display */}
        <div className="flex items-baseline gap-1.5 pt-1">
          <span className="text-3xl font-black tracking-tight text-foreground font-mono">
            {currentPrice === 0 ? 'Free' : `₹${currentPrice.toLocaleString('en-IN')}`}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            / {getBillingCycleLabel(selectedCycle).toLowerCase()}
          </span>
        </div>

        <Separator />

        {/* Dynamic Features & Limits */}
        <CardContent className="p-0 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Plan Capacity & Limits
          </div>
          <ul className="space-y-2">
            {Object.entries(plan.features).map(([key, value]) => (
              <li key={key} className="flex items-center gap-2 text-xs text-foreground/90">
                <div className="h-4 w-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5" />
                </div>
                <span>
                  <strong className="text-foreground capitalize">{key.replace(/_/g, ' ')}:</strong>{' '}
                  {typeof value === 'number' ? value.toLocaleString() : String(value)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>

      {/* Action Footer */}
      <CardFooter className="p-0 pt-6">
        {canEdit ? (
          <div className="w-full flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditPlan?.(plan)}
              className="flex-1 text-xs font-bold rounded-xl h-9 cursor-pointer gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-9 px-3 text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />Delete
            </Button>
          </div>
        ) : userRole === UserRole.ADMIN && !isPlatformPlan ? (
          <div className="w-full flex items-center justify-center gap-1.5 py-1 text-xs text-muted-foreground font-semibold">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Organization Managed</span>
          </div>
        ) : (
          <Button
            variant={isCurrent ? 'outline' : 'default'}
            size="sm"
            disabled={isCurrent || !plan.is_active}
            onClick={() => onSelectPlan?.(plan, selectedCycle)}
            className={`w-full text-xs font-bold rounded-xl h-9 cursor-pointer gap-1.5 ${
              !isCurrent ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''
            }`}
          >
            {isCurrent ? (
              'Current Subscription'
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                <span>Subscribe Tier</span>
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
    {/* Delete Confirmation Dialog */}
<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-3xl p-6 shadow-2xl border border-border/80">
    <DialogHeader className="space-y-3">
      <div className="h-10 w-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <DialogTitle className="text-lg font-black tracking-tight text-foreground">
        Delete Subscription Plan
      </DialogTitle>
      <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
        Are you sure you want to delete <strong className="text-foreground font-bold">"{plan.name}"</strong>? This action cannot be undone and will permanently remove this tier.
      </DialogDescription>
    </DialogHeader>

    <DialogFooter className="pt-4 border-t border-border/60 gap-2 sm:gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsDeleteDialogOpen(false)}
        className="rounded-xl text-xs font-semibold h-9 flex-1 sm:flex-none cursor-pointer"
      >
        Cancel
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={handleConfirmDelete}
        className="rounded-xl text-xs font-bold h-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground flex-1 sm:flex-none cursor-pointer"
      >
        Delete Plan
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</>
  )
}