import { useState } from 'react'
import { CheckCircle2, ShieldCheck, Smartphone, CreditCard, Building, Loader2 } from 'lucide-react'
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
import {
  UserRole,
  type UserRoleType,
  OrgPaymentMethod,
  OrgPaymentGateway,
  OrgTransactionStatus,
  type PlatformPlanEntity,
  type OrganizationPlanEntity,
  getBillingCycleLabel,
} from '../utils/subscriptionValidation'

interface CheckoutDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  plan: PlatformPlanEntity | OrganizationPlanEntity | null
  billingCycle: number
  userRole: UserRoleType
  onPaymentSuccess: (transactionData: any) => void
}

export default function CheckoutDialog({
  isOpen,
  onOpenChange,
  plan,
  billingCycle,
  userRole,
  onPaymentSuccess,
}: CheckoutDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<number>(OrgPaymentMethod.UPI)

  if (!plan) return null

  const basePrice = plan.pricing[billingCycle] ?? 0
  const taxAmount = Math.round(basePrice * 0.18)
  const totalAmount = basePrice + taxAmount

  const handleExecutePayment = () => {
    setIsProcessing(true)

    setTimeout(() => {
      const generatedOrderId = `order_RZP_${Math.floor(100000 + Math.random() * 900000)}`
      const generatedTxId = `pay_RZP_${Math.floor(100000 + Math.random() * 900000)}`

      const payload = {
        transaction_id: `tx-${Date.now()}`,
        plan_id: plan.plan_id,
        plan_name: plan.name,
        billing_cycle: billingCycle,
        amount: totalAmount,
        currency: plan.currency,
        payment_method: selectedMethod,
        payment_gateway: OrgPaymentGateway.Razorpay,
        gateway_order_id: generatedOrderId,
        gateway_transaction_id: generatedTxId,
        status: OrgTransactionStatus.Success,
        features: plan.features,
        created_at: new Date().toISOString(),
      }

      setIsProcessing(false)
      setIsCompleted(true)
      onPaymentSuccess(payload)
    }, 1200)
  }

  const handleClose = () => {
    setIsCompleted(false)
    setIsProcessing(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        {isCompleted ? (
          <div className="py-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-black text-foreground">Subscription Activated</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Payment verified for <strong className="text-foreground">{plan.name}</strong>.
              </DialogDescription>
            </div>
            <Button
              onClick={handleClose}
              className="w-full h-9 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Continue to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-black tracking-tight">Checkout Order</DialogTitle>
                <Badge variant="outline" className="text-[10px] font-bold">
                  {getBillingCycleLabel(billingCycle)}
                </Badge>
              </div>
              <DialogDescription className="text-xs">
                {userRole === UserRole.STUDENT
                  ? 'Purchasing test series subscription for enrolled organization.'
                  : 'Renewing platform organization subscription quota.'}
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold text-foreground">
                <span>{plan.name}</span>
                <span>₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground text-[11px]">
                <span>GST (18% Simulated)</span>
                <span>₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-black text-sm text-foreground pt-0.5">
                <span>Total Amount</span>
                <span className="text-indigo-600 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-foreground">Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: OrgPaymentMethod.UPI, label: 'UPI / QR', icon: Smartphone },
                  { id: OrgPaymentMethod.Card, label: 'Cards', icon: CreditCard },
                  { id: OrgPaymentMethod.NetBanking, label: 'Net Banking', icon: Building },
                ].map((item) => {
                  const Icon = item.icon
                  const isSelected = selectedMethod === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedMethod(item.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                          : 'border-border bg-background hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Processed securely via Razorpay payment gateway</span>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={handleClose}
                className="rounded-xl text-xs font-semibold h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isProcessing}
                onClick={handleExecutePayment}
                className="rounded-xl text-xs font-bold h-9 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}