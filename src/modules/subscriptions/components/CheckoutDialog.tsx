import { useState } from 'react'
import { CheckCircle2, ShieldCheck, Zap, Loader2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { loadRazorpayScript } from '../utils/razorpay'
import {
  UserRole,
  type UserRoleType,
  type PlatformPlanEntity,
  type OrganizationPlanEntity,
  getBillingCycleLabel,
} from '../utils/subscriptionValidation'

interface CheckoutDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  plan: PlatformPlanEntity | OrganizationPlanEntity | null
  billingCycle?: number
  userRole: UserRoleType
  onPaymentSuccess: (transactionData: any) => void
}

export default function CheckoutDialog({
  isOpen,
  onOpenChange,
  plan,
  billingCycle = 1,
  userRole,
  onPaymentSuccess,
}: CheckoutDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!plan) return null

  const basePrice = plan.pricing[billingCycle] ?? 0

  const razorpayKey =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_RAZORPAY_KEY_ID) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_RAZORPAY_KEY_ID) ||
    ''

  const handleExecutePayment = async () => {
    try {
      setIsProcessing(true)
      setErrorMessage(null)

      // 1. Ensure Razorpay SDK script is ready
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        throw new Error('Unable to load payment SDK. Please check your internet connection.')
      }

      // 2. Delegate Order Creation to Payment Service
      const orderData = await paymentService.createOrder({
        planId: plan.plan_id,
        billingCycle: Number(billingCycle),
      })

      // 3. Open Razorpay Gateway Modal
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Mock Test Platform',
        description: `Plan: ${plan.name} (${getBillingCycleLabel(billingCycle)})`,
        order_id: orderData.id,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            // 4. Delegate Signature Verification to Payment Service
            const verifyData = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            setIsProcessing(false)
            setIsCompleted(true)
            onPaymentSuccess(verifyData)
          } catch (verifyError: any) {
            setIsProcessing(false)
            setErrorMessage(verifyError.message || 'Payment verification failed.')
          }
        },
        modal: {
          ondismiss: async () => {
            setIsProcessing(false)
            // 5. Delegate Cancellation Reporting to Payment Service
            await paymentService.markPaymentFailed({
              gateway_order_id: orderData.id,
              error_reason: 'payment_cancelled',
            })
          },
        },
        theme: {
          color: '#4f46e5',
        },
      }

      const rzp = new (window as any).Razorpay(options)

      rzp.on('payment.failed', async (response: any) => {
        setIsProcessing(false)
        setErrorMessage(response.error?.description || 'Transaction declined.')
        await paymentService.markPaymentFailed({
          gateway_order_id: orderData.id,
          error_reason: response.error?.code || response.error?.reason || 'payment_failed',
        })
      })

      rzp.open()
    } catch (err: any) {
      setIsProcessing(false)
      setErrorMessage(err.message || 'Payment initiation failed.')
    }
  }

  const handleClose = () => {
    setIsCompleted(false)
    setIsProcessing(false)
    setErrorMessage(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-3xl p-6 shadow-2xl border border-border/80 my-auto">
        {isCompleted ? (
          <div className="py-6 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-black text-foreground">
                Subscription Activated
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Payment verified for <strong className="text-foreground">{plan.name}</strong>. Quotas and access limits are now active.
              </DialogDescription>
            </div>
            <Button
              onClick={handleClose}
              className="w-full h-10 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-black tracking-tight text-foreground">
                  Checkout Order
                </DialogTitle>
                <Badge variant="outline" className="text-[10px] font-bold border-indigo-500/30 text-indigo-600 bg-indigo-500/10">
                  {getBillingCycleLabel(billingCycle)}
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                {userRole === UserRole.STUDENT
                  ? 'Purchasing test series subscription for enrolled organization.'
                  : 'Renewing platform organization subscription quota.'}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold text-foreground">
                <span>{plan.name}</span>
                <span>₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-black text-sm text-foreground pt-0.5">
                <span>Total Amount</span>
                <span className="text-indigo-600 font-mono text-base">
                  ₹{basePrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="break-words">{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Processed securely via Razorpay payment gateway</span>
            </div>

            <DialogFooter className="pt-3 border-t border-border/60 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={handleClose}
                className="rounded-xl text-xs font-semibold h-9 flex-1 sm:flex-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isProcessing}
                onClick={handleExecutePayment}
                className="rounded-xl text-xs font-bold h-9 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 flex-1 sm:flex-none cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    <span>Pay ₹{basePrice.toLocaleString('en-IN')}</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}