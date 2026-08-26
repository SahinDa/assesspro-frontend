import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sliders } from 'lucide-react'
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

// Source of truth from config
import {
  PlatformSubscriptionFeatureKey,
  OrganizationSubscriptionFeatureKey,
} from '@/config/enums'

import {
  CreatePlatformPlanDtoSchema,
  CreateOrganizationPlanDtoSchema,
  type PlatformPlanEntity,
  type OrganizationPlanEntity,
  SupportedCurrency,
} from '../utils/subscriptionValidation'

interface PlanFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  planToEdit?: PlatformPlanEntity | OrganizationPlanEntity | null
  isPlatformPlan: boolean
  onSubmit: (formData: any) => void
}

const DEFAULT_ENUM_VALUES: Record<string, number> = {
  [PlatformSubscriptionFeatureKey.MAX_USERS]: 500,
  [PlatformSubscriptionFeatureKey.MAX_TESTS]: 100,
  [PlatformSubscriptionFeatureKey.MAX_SETS_PER_TEST]: 5,
  [PlatformSubscriptionFeatureKey.MAX_QUESTIONS_PER_SET]: 100,
  [OrganizationSubscriptionFeatureKey.MAX_TEST_SETS]: 20,
  [OrganizationSubscriptionFeatureKey.MAX_REATTEMPTS]: 2,
}

export default function PlanFormDialog({
  isOpen,
  onOpenChange,
  planToEdit,
  isPlatformPlan,
  onSubmit,
}: PlanFormDialogProps) {
  const schema = isPlatformPlan ? CreatePlatformPlanDtoSchema : CreateOrganizationPlanDtoSchema
  const [pricingError, setPricingError] = useState<string | null>(null)

  // Strictly extract keys from the active Enum
  const targetEnum = isPlatformPlan
    ? PlatformSubscriptionFeatureKey
    : OrganizationSubscriptionFeatureKey
  const enumKeys = Object.values(targetEnum)

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
        '2': '' as any,
        '3': 8999,
      },
      features: {},
    },
  })

  // Sync form state directly on open/edit
  useEffect(() => {
    if (!isOpen) return

    setPricingError(null)
    if (planToEdit) {
      const existingFeatures = planToEdit.features || {}
      const populatedFeatures: Record<string, number> = {}

      enumKeys.forEach((key) => {
        populatedFeatures[key] = Number(existingFeatures[key] ?? DEFAULT_ENUM_VALUES[key] ?? 10)
      })

      reset({
        name: planToEdit.name,
        description: planToEdit.description || '',
        currency: (planToEdit.currency as SupportedCurrency) || SupportedCurrency.INR,
        pricing: {
          '1': planToEdit.pricing?.['1'] !== undefined ? Number(planToEdit.pricing['1']) : ('' as any),
          '2': planToEdit.pricing?.['2'] !== undefined ? Number(planToEdit.pricing['2']) : ('' as any),
          '3': planToEdit.pricing?.['3'] !== undefined ? Number(planToEdit.pricing['3']) : ('' as any),
        },
        features: populatedFeatures,
      })
    } else {
      const initialFeatures: Record<string, number> = {}
      enumKeys.forEach((key) => {
        initialFeatures[key] = DEFAULT_ENUM_VALUES[key] ?? 10
      })

      reset({
        name: '',
        description: '',
        currency: SupportedCurrency.INR,
        pricing: {
          '1': 999,
          '2': '' as any,
          '3': 8999,
        },
        features: initialFeatures,
      })
    }
  }, [isOpen, planToEdit, isPlatformPlan, reset])

  const handleFormSubmit = (data: any) => {
    const monthlyPrice = data.pricing?.['1']

    if (monthlyPrice === undefined || monthlyPrice === null || isNaN(Number(monthlyPrice)) || Number(monthlyPrice) <= 0) {
      setPricingError('Monthly base price is required and must be greater than 0.')
      return
    }

    // Build pricing payload with mandatory Monthly and optional cycles
    const cleanedPricing: Record<string, number> = {
      '1': Number(monthlyPrice),
    }

    if (data.pricing?.['2'] !== undefined && !isNaN(Number(data.pricing['2'])) && Number(data.pricing['2']) > 0) {
      cleanedPricing['2'] = Number(data.pricing['2'])
    }

    if (data.pricing?.['3'] !== undefined && !isNaN(Number(data.pricing['3'])) && Number(data.pricing['3']) > 0) {
      cleanedPricing['3'] = Number(data.pricing['3'])
    }

    setPricingError(null)
    onSubmit({
      ...data,
      description: data.description?.trim() || undefined,
      pricing: cleanedPricing,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-lg md:max-w-xl max-h-[85vh] h-auto overflow-y-auto rounded-3xl p-5 sm:p-7 shadow-2xl border border-border/80 my-auto overscroll-contain"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-2">
          {/* Plan Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">
              Plan Name <span className="text-destructive">*</span>
            </label>
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
            <label className="text-xs font-bold text-foreground block">
              Description <span className="text-muted-foreground font-normal text-[11px]">(optional)</span>
            </label>
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

          {/* 3 Billing Cycles - Monthly Required, Others Optional */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground block">
                Cycle Pricing (₹ INR) <span className="text-destructive">*</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Monthly is required; others are optional
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-semibold block">
                  Monthly (1) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 999"
                  className="h-9 rounded-xl text-xs font-mono"
                  {...register('pricing.1', {
                    setValueAs: (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
                  })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-semibold block">
                  Quarterly (2) <span className="text-muted-foreground font-normal text-[10px]">(optional)</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  placeholder="Optional"
                  className="h-9 rounded-xl text-xs font-mono"
                  {...register('pricing.2', {
                    setValueAs: (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
                  })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-semibold block">
                  Yearly (3) <span className="text-muted-foreground font-normal text-[10px]">(optional)</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  placeholder="Optional"
                  className="h-9 rounded-xl text-xs font-mono"
                  {...register('pricing.3', {
                    setValueAs: (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
                  })}
                />
              </div>
            </div>
            {pricingError && (
              <p className="text-[11px] text-destructive font-medium mt-1">{pricingError}</p>
            )}
          </div>

          {/* Strictly Enum-Driven Feature Quotas */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                Feature Quotas & Limits ({enumKeys.length})
              </span>
            </div>

            {/* Grid rendering exact enum keys */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enumKeys.map((key) => (
                <div key={key} className="space-y-1 p-2.5 rounded-xl border border-border/70 bg-muted/20">
                  <label className="text-[11px] font-semibold text-foreground capitalize truncate block">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <Input
                    type="number"
                    min={0}
                    className="h-8 text-xs font-mono rounded-lg bg-card"
                    {...register(`features.${key}`, {
                      setValueAs: (v) => (v === '' || v === null || v === undefined ? 0 : Number(v)),
                    })}
                  />
                </div>
              ))}
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
              className="rounded-xl text-xs font-bold h-9 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              {planToEdit ? 'Update Plan' : 'Publish Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}