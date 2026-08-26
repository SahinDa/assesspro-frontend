import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  CreatePlatformPlanDtoSchema,
  CreateOrganizationPlanDtoSchema,
  type PlatformPlanEntity,
  type OrganizationPlanEntity,
  SupportedCurrency,
  PlatformSubscriptionFeatureKey,
  OrganizationSubscriptionFeatureKey,
} from '../utils/subscriptionValidation'

interface PlanFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  planToEdit?: PlatformPlanEntity | OrganizationPlanEntity | null
  isPlatformPlan: boolean
  onSubmit: (formData: any) => void
}

export default function PlanFormDialog({
  isOpen,
  onOpenChange,
  planToEdit,
  isPlatformPlan,
  onSubmit,
}: PlanFormDialogProps) {
  const schema = isPlatformPlan ? CreatePlatformPlanDtoSchema : CreateOrganizationPlanDtoSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      currency: SupportedCurrency.INR,
      pricing: {
        '1': 999,
        '3': 9999,
      },
      features: isPlatformPlan
        ? {
            [PlatformSubscriptionFeatureKey.MAX_USERS]: 500,
            [PlatformSubscriptionFeatureKey.MAX_TESTS]: 100,
            [PlatformSubscriptionFeatureKey.MAX_SETS_PER_TEST]: 5,
            [PlatformSubscriptionFeatureKey.MAX_QUESTIONS_PER_SET]: 100,
          }
        : {
            [OrganizationSubscriptionFeatureKey.MAX_TEST_SETS]: 20,
            [OrganizationSubscriptionFeatureKey.MAX_REATTEMPTS]: 2,
          },
    },
  })

  useEffect(() => {
    if (planToEdit) {
      reset({
        name: planToEdit.name,
        description: planToEdit.description || '',
        currency: (planToEdit.currency as SupportedCurrency) || SupportedCurrency.INR,
        pricing: Object.fromEntries(
          Object.entries(planToEdit.pricing).map(([k, v]) => [String(k), Number(v)])
        ),
        features: planToEdit.features as any,
      })
    }
  }, [planToEdit, reset])

  const handleFormSubmit = (data: any) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">
            {planToEdit ? 'Configure Subscription Plan' : 'Create Subscription Plan'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isPlatformPlan
              ? 'Define platform quotas and B2B pricing for subscriber organizations.'
              : 'Configure test series capacity and access limits for your enrolled students.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          {/* Plan Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">Plan Name</label>
            <Input
              placeholder="e.g. Pro Academy Tier"
              className="h-9 rounded-xl text-xs"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">{errors.name.message as string}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">Description</label>
            <Textarea
              placeholder="Brief overview of tier capabilities..."
              className="rounded-xl text-xs resize-none"
              rows={2}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.description.message as string}
              </p>
            )}
          </div>

          {/* Pricing Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground block">Cycle Pricing (₹ INR)</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-semibold block">
                  Monthly (Cycle 1)
                </label>
                <Input
                  type="number"
                  min={0}
                  className="h-9 rounded-xl text-xs font-mono"
                  {...register('pricing.1', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-semibold block">
                  Yearly (Cycle 3)
                </label>
                <Input
                  type="number"
                  min={0}
                  className="h-9 rounded-xl text-xs font-mono"
                  {...register('pricing.3', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Feature Limits */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground block">Feature Limits & Quotas</span>
            <div className="grid grid-cols-2 gap-3">
              {isPlatformPlan ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground block">Max Students</label>
                    <Input
                      type="number"
                      className="h-9 rounded-xl text-xs font-mono"
                      {...register(`features.${PlatformSubscriptionFeatureKey.MAX_USERS}`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground block">Max Tests</label>
                    <Input
                      type="number"
                      className="h-9 rounded-xl text-xs font-mono"
                      {...register(`features.${PlatformSubscriptionFeatureKey.MAX_TESTS}`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground block">Max Test Sets</label>
                    <Input
                      type="number"
                      className="h-9 rounded-xl text-xs font-mono"
                      {...register(`features.${OrganizationSubscriptionFeatureKey.MAX_TEST_SETS}`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground block">Max Reattempts</label>
                    <Input
                      type="number"
                      className="h-9 rounded-xl text-xs font-mono"
                      {...register(`features.${OrganizationSubscriptionFeatureKey.MAX_REATTEMPTS}`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs font-semibold h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-xl text-xs font-bold h-9 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {planToEdit ? 'Update Plan' : 'Publish Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}